const Recipe = ({ data }) => {
  return data && (
    <>
      <div className="school-block-wrapper">
        <p>{data?.label}</p>
      </div>
    </>
  );
}

export default Recipe;