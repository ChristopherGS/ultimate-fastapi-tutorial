import config from "./config"
import jwtDecode from "jwt-decode"
import * as moment from "moment"
import { nanoid } from "nanoid"
const axios = require("axios")

let LANDING_PAGE_DEFAULT = {
	title: "",
	subtitle: "",
	overviewHeading: "",
	overviewBody: "",
	testimonialsHeading: "",
	testimonialsBody: "",
	faqHeading: "",
	faqBody: "",
	contactHeading: "",
	contactBody: "",
	image: [],
}

global.cmsIsBusy = false
global.queuedVideoUploads = []

class CourseMakerClient {
	constructor(overrides) {
		this.config = {
			...config,
			...overrides,
		}
		this.authToken = config.authToken

		this.login = this.login.bind(this)
		this.getCmsClient = this.getCmsClient.bind(this)

		this.cmsClient = this.getCmsClient(this.config)
		this.apiClient = this.getApiClient(this.config)
		this.apiClientEmpty = this.getApiClientEmpty(this.config)
	}

	/* ----- Authentication & User Operations ----- */

	/* Authenticate the user with the backend services.
	 * The same JWT should be valid for both the api and cms */
	login(username, password) {
		delete this.apiClient.defaults.headers["Authorization"]

		// HACK: This is a hack until we have an actual login form
		var form_data = new FormData()
		const grant_type = "password"
		const item = { grant_type, username, password }
		for (var key in item) {
			form_data.append(key, item[key])
		}

		return this.apiClient
			.post("/login/access-token", form_data)
			.then((resp) => {
				localStorage.setItem("token", JSON.stringify(resp.data))
				this.cmsClient = this.getCmsClient(this.config)
				this.apiClient = this.getApiClient(this.config)
				return this.fetchUser()
			})
	}

	fetchUser() {
		return this.apiClient.get("/users/me").then(({ data }) => {
			localStorage.setItem("user", JSON.stringify(data))
		})
	}

	fetchAndReturnUser() {
		return this.apiClient.get("/users/me").then(({ data }) => {
			return data
		})
	}

	resendConfirmationEmail() {
		return this.apiClient.get("/users/resend-confirm").then(({ data }) => {
			return data
		})
	}

	resetPasswordEmail(email, client_id) {
		const resetData = {
			email,
			client_id,
		}

		return this.apiClient
			.post("/users/send-password-reset", resetData)
			.then(({ data }) => {
				return data
			})
			.catch((err) => {
				console.log(`error! ${err}`)
				return err.response
			})
	}

	register(email, password, fullName, code) {
		const loginData = {
			email,
			password,
			full_name: fullName,
			is_active: true,
		}

		return this.apiClient.post("/users/signup", loginData).then((resp) => {
			return resp.data
		})
	}

	// Logging out is just deleting the jwt.
	logout(username, password) {
		if (this.cmsClient) {
			delete this.cmsClient.defaults.headers["Authorization"]
		}
		// Add here any other data that needs to be deleted from local storage
		// on logout
		localStorage.removeItem("token")
		localStorage.removeItem("user")
	}
	/* ----- Client Configuration ----- */

	/* Create Axios client instance pointing at the REST api backend */
	getApiClient(config) {
		let initialConfig = {
			baseURL: `${config.apiBasePath}/api/v1`,
		}
		let client = axios.create(initialConfig)
		client.interceptors.request.use(localStorageTokenInterceptor)
		return client
	}

	/* Create Axios client instance pointing at the REST api backend */
	getApiClientEmpty(config) {
		let initialConfig = {
			baseURL: `${config.apiBasePath}/api/v1`,
		}
		let client = axios.create(initialConfig)
		return client
	}

	/* Create Axios client instance pointing at the cms */
	getCmsClient(config) {
		let initialConfig = {
			baseURL: config.cmsBasePath,
		}
		let client = axios.create(initialConfig)
		client.interceptors.request.use(localStorageTokenInterceptor)
		return client
	}

	getPK() {
		return this.apiClient.get(`/payments/pk`).then(({ data }) => data)
	}

	/* ---- Payments & Prices -----*/

	getSchoolStripeAccountLink(school) {
		return this.apiClient
			.get(`/schools/${school.external_id}/stripe-account-link`)
			.then(({ data }) => data)
	}

	linkSchoolStripeAccount(school_id, code) {
		const data = { code: code }
		return this.apiClient
			.post(`/schools/${school_id}/stripe-account-link`, data)
			.then(({ data }) => data)
	}

	createPaddleAccountLink(school_id, paddleAccountDetails) {
		return this.apiClient
			.post(`/schools/${school_id}/paddle-account-link`, paddleAccountDetails)
			.then(({ data }) => data)
	}

	getSchoolPrices(school = undefined) {
		let filter_spec = school
			? `?filter_spec=[{"field":"school_id","op":"==","value":"${school.external_id}"}]`
			: ""
		return this.apiClient
			.get(`/school_prices${filter_spec}`)
			.then(({ data }) => data)
	}

	createSchoolPrice(schoolPrice) {
		return this.apiClient
			.post("/school_prices/", schoolPrice)
			.then((resp) => this.refreshToken().then(() => resp.data))
	}

	updateSchoolPrice(schoolPrice) {
		return this.apiClient
			.put(`/school_prices/${schoolPrice.id}/`, schoolPrice)
			.then(({ data }) => data)
	}

	/* Coupons */
	getSchoolCoupons(school = undefined) {
		let filter_spec = school
			? `?filter_spec=[{"field":"school_id","op":"==","value":"${school.external_id}"}]`
			: ""
		return this.apiClient
			.get(`/school_coupons${filter_spec}`)
			.then(({ data }) => data)
	}

	createSchoolCoupon(schoolCoupon) {
		return this.apiClient
			.post("/school_coupons/", schoolCoupon)
			.then((resp) => this.refreshToken().then(() => resp.data))
	}

	updateSchoolCoupon(schoolCoupon) {
		return this.apiClient
			.put(`/school_coupons/`, schoolCoupon)
			.then(({ data }) => data)
	}

	/* End Coupons */

	updateSchoolName(updatedName, school) {
		let payload = {
			name: updatedName,
		}
		return this.apiClient
			.put(`/schools/${school.external_id}/`, payload)
			.then(({ data }) => {
				return data
			})
	}

	/* ---- Billing -----*/

	getBillingPrices() {
		return this.apiClient.get(`/prices/`).then(({ data }) => data)
	}

	getSchoolSubscription(school) {
		return this.apiClient
			.get(`/schools/${school.external_id}/subscription`)
			.then(({ data }) => data)
	}

	getSchoolBillingHistory(school) {
		return this.apiClient
			.get(`/schools/${school.external_id}/billing-history`)
			.then(({ data }) => data)
	}

	setSchoolPromotion(school, planData) {
		return this.apiClient
			.post(`/school_promotions`, {
				school_id: school.external_id,
				code: planData.code,
				usage_count: planData.usage_count,
			})
			.then(({ data }) => data)
	}

	setSchoolSubscription(school, planData) {
		return this.apiClient
			.post(`/schools/${school.external_id}/subscription`, planData)
			.then(({ data }) => data)
	}

	updateSchoolSubscription(school, planData) {
		return this.apiClient
			.put(`/schools/${school.external_id}/subscription`, planData)
			.then(({ data }) => data)
	}

	updateSchoolDefaultPaymentMethod(school, data) {
		return this.apiClient
			.put(`/schools/${school.external_id}/default-payment-method`, data)
			.then(({ data }) => data)
	}

	/* ----- School Administration Operations ----- */

	createSchool(school) {
		return this.apiClient
			.post("/schools/", school) // doesn't work without '/' in the end
			.then((resp) => this.refreshToken().then(() => resp.data))
	}
	createCourse(course) {
		return this.apiClient.post("/courses/", course).then(({ data }) => {
			return this.cmsClient.get(`/courses/${data.id}`)
		})
	}

	getSchools(pageNumber = 1, pageSize = 50) {
		return this.apiClient
			.get(`/schools/?page_size=${pageSize}&page_number=${pageNumber}`)
			.then(({ data }) => data)
	}

	getSchool(school_id) {
		return this.apiClient.get(`/schools/${school_id}`).then(({ data }) => data)
	}

	getSchoolContent(school_cms_id) {
		return this.cmsClient.get(`/schools/${school_cms_id}`)
	}

	getCourseContent(course_cms_id) {
		return this.cmsClient.get(`/courses/${course_cms_id}`)
	}

	createCustomDomain(domainName, school) {
		return (
			this.apiClient
				.post("/custom_domains/", {
					school_id: school.external_id,
					domain_name: domainName,
				})
				// Refresh token because extra domain now there
				.then((resp) => this.refreshToken().then(() => resp.data))
		)
	}

	confirmCustomDomain(customDomainID) {
		return this.apiClient
			.post(`/custom_domains/${customDomainID}/confirm`)
			.then((resp) => resp.data)
	}

	deactivateCustomDomain(customDomainID) {
		return this.apiClient
			.post(`/custom_domains/${customDomainID}/deactivate`)
			.then((resp) => this.refreshToken().then(() => resp.data))
	}

	/* ----- Code Labs ------ */
	createCodeSubmission(
		sourceCode,
		expectedOutput,
		codeExecutionBackend,
		languageID
	) {
		if (!languageID) {
			return Promise.reject("No language selected")
		}

		return this.apiClient
			.post(`/code/submissions`, {
				source_code: sourceCode,
				expected_output: expectedOutput,
				language_id: languageID,
				code_execution_backend: codeExecutionBackend,
			})
			.then((resp) => resp)
	}

	getCodeSubmission(codeSubmissionToken, codeExecutionBackend) {
		return this.apiClient
			.post(`/code/submissions/poll`, {
				token: codeSubmissionToken,
				code_execution_backend: codeExecutionBackend,
			})
			.then((resp) => resp)
	}

	getSupportedLanguages() {
		return this.apiClient.get(`/code/supported-languages`).then((resp) => resp)
	}

	/* ----- Build Operations ----- */
	setBuildStatus(id, build_status) {
		return this.cmsClient
			.put(`/site-builds/${id}`, { status: build_status })
			.then(({ data }) => data)
	}

	getBuildStatus(school) {
		return this.cmsClient
			.get(
				`/site-builds?school.id=${school.id}&preview=false&_sort=queue_date:DESC&_limit=1`
			)
			.then(({ data }) => {
				if (!data.length) {
					return
				}
				if (data[0]) {
					let currentCmsStatus = data[0].status
					if (
						currentCmsStatus !== "building" &&
						currentCmsStatus !== "queued"
					) {
						this.enqueuePendingVideoUploads()
					}
					return data[0]
				}
			})
	}

	makePreview(school, preview, clearCache) {
		global.cmsIsBusy = true
		let target_domain
		let params = {
			preview,
			clear_cache: clearCache,
		}
		return this.apiClient
			.post("/builds/build", school, { params: params })
			.then((res) => {
				let data = res["data"]
				let id = data["site_build_id"]
				target_domain = data["target_domain"]
				return this.cmsClient.get(`/site-builds/${id}`, school)
			})
			.then((res) => {
				let data = res["data"]
				return {
					status: data["status"],
					url: target_domain,
				}
			})
			.catch((res) => {
				let data = res["data"]
				this.enqueuePendingVideoUploads()
				return {
					status: data["status"],
					url: target_domain,
				}
			})
	}

	createTempStudentAuthorisationCode(school) {
		return this.apiClient
			.post(`/schools/${school.external_id}/authorisation-code`)
			.then(({ data }) => data)
	}

	/* ----- Media Operations ----- */

	uploadCourseLogo(schoolExternalID, course, file) {
		let cmsResponse = this.getPresignedURL(
			"image",
			schoolExternalID,
			null,
			course,
			"course-logo",
			file
		)
			.then((data) => {
				return this.uploadFileToS3(data, file)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "course",
					field: "logo",
					id: course.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => {
			return resp.data[0]
		})
	}

	uploadLectureVideo(
		schoolExternalID,
		lecture,
		file,
		uploadProgressCallback,
		uploadCompleteCallback,
		onErrorCallback
	) {
		let id = nanoid()

		if (global.cmsIsBusy) {
			global.queuedVideoUploads.push({
				id,
				schoolExternalID,
				lecture,
				file,
				uploadProgressCallback,
				uploadCompleteCallback,
				onErrorCallback,
			})
		} else {
			this.performLectureVideoUpload({
				id,
				schoolExternalID,
				lecture,
				file,
				uploadProgressCallback,
				uploadCompleteCallback,
				onErrorCallback,
			})
		}

		//We'll return a boolean variable here to account for future needs - maybe permissions checking, error handling, anything else which might come up, should belong inside this function, and should return an immediate result.
		return true
	}

	enqueuePendingVideoUploads() {
		global.cmsIsBusy = false
		global.queuedVideoUploads.forEach((video) =>
			this.performLectureVideoUpload(video)
		)
	}

	performLectureVideoUpload({
		id,
		schoolExternalID,
		lecture,
		file,
		uploadProgressCallback,
		uploadCompleteCallback,
		onErrorCallback,
	}) {
		let queuedItem = global.queuedVideoUploads
			.map((item) => item.id)
			.indexOf(id)
		queuedItem >= 0 && global.queuedVideoUploads.splice(queuedItem, 1)

		let cmsResponse = this.getPresignedURL(
			"video",
			schoolExternalID,
			lecture,
			null,
			`lecture-video-${lecture.id}`,
			file
		) //school add here
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "lecture",
					field: "video",
					id: lecture.id,
				})
			})
			.catch((e) => onErrorCallback(e))

		/* Return public url for preview */
		cmsResponse
			.then((resp) => uploadCompleteCallback(resp.data[0]))
			.catch((e) => onErrorCallback(e))
	}
	/* ---- Media -----*/
	signVideoURL(videoID) {
		return this.apiClient
			.get(`media/video/${videoID}/sign`)
			.then(({ data }) => {
				return data
			})
	}

	uploadLectureFile(schoolExternalID, lecture, file, uploadProgressCallback) {
		let course
		return this.getLecture(lecture?.id).then((resp) => {
			course = resp?.data?.section?.course
			if (!course) {
				alert("please give your lecture a title before uploading a file")
				return Promise.reject(
					"please give your lecture a title before uploading a file"
				)
			}
			let cmsResponse = this.getPresignedURL(
				"pdf",
				schoolExternalID,
				lecture,
				course,
				`lecture-file-${lecture.id}`,
				file
			) //school add here
				.then((data) => {
					return this.uploadFileToS3(data, file, uploadProgressCallback)
				})
				.then((data) => {
					return this.uploadMetadataToCMS(
						data,
						{
							name: "lecture",
							field: "file_attachment",
							id: lecture.id,
						},
						file.name
					)
				})
			/* Return public url for preview */
			return cmsResponse.then((resp) => {
				return resp.data[0]
			})
		})
	}

	uploadCourseLandingVideo(
		schoolExternalID,
		course,
		file,
		uploadProgressCallback
	) {
		let cmsResponse = this.getPresignedURL(
			"video",
			schoolExternalID,
			null,
			course,
			"course-video",
			file
		)
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "course-landing-page",
					field: "video",
					id: course.course_landing_page.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => {
			return resp.data[0]
		})
	}

	uploadCourseLandingAuthorPhoto(
		schoolExternalID,
		course,
		file,
		uploadProgressCallback
	) {
		let cmsResponse = this.getPresignedURL(
			"image",
			schoolExternalID,
			null,
			course,
			course.id,
			file
		)
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "course",
					field: "author_display",
					id: course.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => {
			return resp.data[0]
		})
	}
	uploadCourseLandingImage(
		schoolExternalID,
		course,
		file,
		uploadProgressCallback
	) {
		let cmsResponse = this.getPresignedURL(
			"image",
			schoolExternalID,
			null,
			course,
			"course-landing-image",
			file
		) //school add here
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "course",
					field: "course_image",
					id: course.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => resp.data[0])
	}

	uploadSсhoolLandingVideo(school, file, uploadProgressCallback) {
		let cmsResponse = this.getPresignedURL(
			"video",
			school.external_id,
			null,
			null,
			"school-video",
			file
		) //school add here
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "landing-page",
					field: "video",
					id: school.landing_page.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => {
			return resp.data[0]
		})
	}

	uploadSchoolLogo(school, file, uploadProgressCallback) {
		let cmsResponse = this.getPresignedURL(
			"image",
			school.external_id,
			null,
			null,
			"school-logo",
			file
		) //school add here
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "school",
					field: "logo",
					id: school.cms_id || school.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => {
			return resp.data[0]
		})
	}

	uploadSсhoolFavicon(school, file, uploadProgressCallback) {
		let cmsResponse = this.getPresignedURL(
			"image",
			school.external_id,
			null,
			null,
			"school-favicon",
			file
		) //school add here
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "school",
					field: "favicon",
					id: school.cms_id || school.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => {
			return resp.data[0]
		})
	}

	uploadSсhoolLandingImage(school, file, uploadProgressCallback) {
		let cmsResponse = this.getPresignedURL(
			"image",
			school.external_id,
			null,
			null,
			"school-image",
			file
		) //school add here
			.then((data) => {
				return this.uploadFileToS3(data, file, uploadProgressCallback)
			})
			.then((data) => {
				return this.uploadMetadataToCMS(data, {
					name: "landing-page",
					field: "image",
					id: school.landing_page.id,
				})
			})

		/* Return public url for preview */
		return cmsResponse.then((resp) => resp.data[0])
	}

	getSchoolDashboardData(
		school,
		{
			dashboard_name,
			period_start_at,
			period_end_at,
			selected_data_series,
			selected_metric,
		}
	) {
		return this.apiClient
			.get(`/schools/${school.external_id}/dashboard/${dashboard_name}`, {
				params: {
					period_start_at,
					period_end_at,
					selected_data_series,
					selected_metric,
				},
			})
			.then(({ data }) => data)
	}

	/* If course settings lecture = null
	 * If school settings course = null & lecture = null */
	getPresignedURL(mediaType, schoolExternalID, lecture, course, id, file) {
		/* Parse inputs and find location for upload */
		const filename = `${id}.${file.name}`

		let initial_access
		if (!lecture) {
			initial_access = "public"
		} else {
			initial_access = lecture.allow_preview ? "public" : "private"
		}

		let course_slug

		if (!course) {
			course_slug = null
		} else {
			if (course?.slug) {
				course_slug = course?.slug
			} else if (course?.title) {
				course_slug = slugify(course?.title)
			} else {
				course_slug = null
			}
		}

		// edge case hack for lecture file
		let course_id
		if (course && !course?.id) {
			course_id = course
		} else {
			course_id = course?.id
		}

		/* Get presigned url*/
		const body = {
			media_type: mediaType,
			initial_access: initial_access,
			filename: filename,
			school_id: schoolExternalID,
			course_id: course_id,
			lecture_id: lecture && lecture.id,
			course_slug: course_slug,
		}

		let form = new FormData()
		return this.apiClient
			.post("/media/upload", body)
			.then((response) => {
				let fields = response.data.fields
				for (let key in fields) {
					form.append(key, fields[key])
				}
				form.append("file", file)
				return { url: response.data.url, form: form }
			})
			.catch((err) => {
				console.error("Error retrieving POST url")
				throw err
			})
	}

	uploadFileToS3(presignedPOST, file, uploadProgressCallback) {
		const options = {
			onUploadProgress: (progressEvent) => {
				const { loaded, total } = progressEvent
				const percent = Math.floor((loaded * 100) / total)
				if (uploadProgressCallback) {
					uploadProgressCallback({ loaded, total, percent })
				}
			},
		}
		/* Upload File to S3 */
		let imageURL = `${presignedPOST.url}${presignedPOST.form.get("key")}`
		return axios
			.post(presignedPOST.url, presignedPOST.form, options)
			.then((response) => {
				return { response: response, imageURL: imageURL }
			})
			.catch((err) => {
				console.error(`Error uploading content. ${err}`)
				throw err
			})
	}

	uploadMetadataToCMS(uploadedContent, where, filename = "empty") {
		let formData = new FormData()
		// We send a dummy file for now because we have no need to send
		// the real one. Ideally we should change CMS endpoint to not need
		// a file at all.
		formData.append("files", new File(["a"], filename))
		formData.append("ref", where.name)
		formData.append("refId", where.id)
		formData.append("field", where.field)
		formData.append("path", uploadedContent.imageURL)

		return this.cmsClient
			.post(`/upload`, formData)
			.then((data) => {
				return data
			})
			.catch((err) => {
				console.error(err)
				throw err
			})
	}

	/* ----- Content Operations ----- */

	/* Get all courses.
	 * If options.school_id is set then just get courses for
	 * that school. */
	getCourses(options) {
		return this.cmsClient.get(`/courses?school.id=${options.school_id}`).then(
			(data) => {
				return data
			},
			(err) => {
				console.error(err)
				return { error: err }
			}
		)
	}

	createEmptySectionForCourse(id) {
		const section = {
			course: id,
			title: "",
			description: "",
		}
		return this.cmsClient.post(`/sections`, section).then(
			({ data }) => {
				return data
			},
			(err) => {
				console.error(err)
				return { error: err }
			}
		)
	}

	updateSection(section) {
		return this.cmsClient.put(`/sections/${section.id}`, section).then(
			({ data }) => {
				return data
			},
			(err) => {
				console.error(err)
				return { error: err }
			}
		)
	}

	updateCourse(course) {
		return this.cmsClient
			.put(`/courses/${course.id}`, course)
			.then(({ data }) => {
				return data
			})
	}

	getCourseApi(course) {
	return this.apiClient
		.get(`/courses/${course.id}`)
		.then(({ data }) => {
			return data
		})
	}

	updateCourseApi(courseId, courseUpdates) {
		return this.apiClient
			.put(`/courses/${courseId}`, courseUpdates)
			.then(({ data }) => {
				return data
			})
	}

	updateSchool(school) {
		return this.cmsClient
			.put(`/schools/${school.id}`, school)
			.then(({ data }) => {
				return data
			})
	}

	getSchoolStudents(school) {
		return this.apiClient
			.get(`/schools/${school.external_id}/students`, school)
			.then(({ data }) => {
				return data
			})
	}

	updateLanding(landing) {
		return this.cmsClient
			.put(`/landing-pages/${landing.id}`, landing)
			.then(({ data }) => {
				return data
			})
	}

	updateCourseLanding(landing) {
		return this.cmsClient
			.put(`/course-landing-pages/${landing.id}`, landing)
			.then(({ data }) => {
				return data
			})
	}

	createEmptyCourseLanding(courseId) {
		const landing = {
			...LANDING_PAGE_DEFAULT,
			course: courseId,
		}
		return this.cmsClient.post(`/course-landing-pages`, landing).then(
			({ data }) => {
				return { ...data, course: data.course.id }
			},
			(err) => {
				console.error(err)
				return { error: err }
			}
		)
	}

	createEmptyLanding(schoolId) {
		const landing = {
			...LANDING_PAGE_DEFAULT,
			school: schoolId,
		}
		return this.cmsClient.post(`/landing-pages`, landing).then(
			({ data }) => {
				return { ...data, school: data.school.id }
			},
			(err) => {
				console.error(err)
				return { error: err }
			}
		)
	}

	refreshToken() {
		const tokenString = localStorage.getItem("token")
		if (tokenString) {
			const token = JSON.parse(tokenString)
			const decodedRefreshToken = jwtDecode(token.refresh_token)
			const isRefreshTokenValid =
				moment.unix(decodedRefreshToken.exp).toDate() > new Date()
			if (isRefreshTokenValid) {
				let headers = {}
				headers["Authorization"] = `Bearer ${token.refresh_token}`
				return this.apiClientEmpty
					.post("/login/refresh-token", {}, { headers })
					.then((resp) => {
						localStorage.setItem("token", JSON.stringify(resp.data))
						return this.fetchUser()
					})
			} else {
				//redirect to login
			}
		} else {
			// redirect to login
		}
	}

	createEmptyLectureForSection(id) {
		const lecture = {
			title: "",
			description: "",
			active: true,
			section: id,
			allow_preview: false,
		}
		return this.cmsClient.post(`/lectures`, lecture).then(
			({ data }) => {
				return data
			},
			(err) => {
				console.error(err)
				return { error: err }
			}
		)
	}

	getLecture(lecture_id) {
		return this.cmsClient.get(`/lectures/${lecture_id}`)
	}

	updateLecture(lecture) {
		return this.cmsClient.put(`/lectures/${lecture.id}`, lecture).then(
			({ data }) => {
				return data
			},
			(err) => {
				console.error(err)
				return { error: err }
			}
		)
	}

	deleteLecture(lecture) {
		return this.cmsClient.delete(`/lectures/${lecture.id}`)
	}

	deleteSection(section) {
		return this.cmsClient.delete(`/sections/${section.id}`)
	}

	deleteCourse(course) {
		return this.apiClient.delete(`/courses/${course.id}`)
	}

	getAllSectionsByIdsGraphQL(ids) {
		if (!ids.length) {
			return Promise.resolve([])
		}
		const query = {
			query: `
        {
          ${ids.map(
						(id) => `
              section${id}: section(id: ${id}) {
                id
                title,
                description,
                order,
                lectures {
                  id,
                  title,
                  description,
                  order,
                  active,
                  allow_preview,
                  body_text,
                  body_markdown,
                  file_attachment {
                    id,
                    name,
                    url,
                  }
                  video {
                    id,
                    url
                  },
                  video_id,
                  code_submission_template {
                    title
                    source_code
                    stdin
                    task_list {
                      title
                      body
                    }
                    expected_output
                    cpu_time_limit
                    wall_time_limit
                    language_id
                    hints_markdown
                    code_execution_backend
                  }
                  section {
                    id
                    course {
                      id
                      title
                    }
                  }
                }
              }
            `
					)}
        }
      `,
		}

		return this.cmsClient.post(`/graphql`, query).then(({ data: { data } }) => {
			const sections = Object.values(data)
			return sections
		})
	}
	updateAllLecturesOrdersForSectionGraphQL(lectures) {
		if (!lectures.length) {
			return Promise.resolve([])
		}
		const query = {
			query: `
        mutation {
          ${lectures.map(
						(lecture) => `
              lecture${lecture.id}: updateLecture(input: { where: { id: ${lecture.id} }, data: { order: ${lecture.order} } }) {
                lecture {
                  id,
                  title,
                  description,
                  order,
                  active,
                  allow_preview,
                  body_text,
                  body_markdown,
                  file_attachment {
                    id,
                    name,
                    url,
                  }
                  video {
                    id
                    url
                  },
                  video_id
                }
              }
            `
					)}
        }
      `,
		}

		return this.cmsClient.post(`/graphql`, query).then(({ data: { data } }) => {
			const lectures = Object.values(data).map((el) => el.lecture)
			return lectures
		})
	}

	updateAllSectionsOrdersForSectionGraphQL(sections) {
		if (!sections.length) {
			return Promise.resolve([])
		}
		const query = {
			query: `
        mutation {
          ${sections.map(
						(section) => `
              section${section.id}: updateSection(input: { where: { id: ${section.id} }, data: { order: ${section.order} } }) {
                section {
                  id
                  title,
                  description,
                  order,
                  lectures {
                    id,
                    title,
                    description,
                    order,
                    active,
                    allow_preview,
                    body_text,
                    body_markdown,
                    file_attachment {
                      id,
                      name,
                      url,
                    }
                    video {
                      id,
                      url
                    },
                    video_id
                  }
                }
              }
            `
					)}
        }
      `,
		}

		return this.cmsClient.post(`/graphql`, query).then(({ data: { data } }) => {
			const sections = Object.values(data).map((el) => el.section)
			return sections
		})
	}
}

function slugify(text) {
	return text
		.toString()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-")
}

// every request is intercepted and has auth header injected.
function localStorageTokenInterceptor(config) {
	let headers = {}
	const tokenString = localStorage.getItem("token")

	if (tokenString) {
		const token = JSON.parse(tokenString)
		const decodedAccessToken = jwtDecode(token.access_token)
		const isAccessTokenValid =
			moment.unix(decodedAccessToken.exp).toDate() > new Date()
		if (isAccessTokenValid) {
			headers["Authorization"] = `Bearer ${token.access_token}`
		} else {
			// const decodedRefreshToken = jwtDecode(token.refresh_token);
			// const isRefreshTokenValid = moment.unix(decodedRefreshToken.exp).toDate() > new Date();
		}
	}
	config["headers"] = headers
	return config
}

function formatError(err) {
	// TODO: We should make this work for CMS API errors too and try to use this in all catch blocks

	const detail = err?.response?.data?.detail
	if (typeof detail === "string") {
		return detail
	} else if (typeof detail === "object") {
		// Example error format: [{"loc":["body","custom_domain_in","school_id"],"msg":"str type expected","type":"type_error.str"}]
		return (
			`Error: ` +
			detail
				.map(
					(d) =>
						`the field ${d.loc.slice(-1)[0]} has the following error: ${d.msg}`
				)
				.join(" and ")
		)
	}
	return err.toString()
}

export { CourseMakerClient, formatError }
export default CourseMakerClient
