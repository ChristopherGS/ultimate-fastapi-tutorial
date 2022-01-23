import React from 'react';
import './index.scss';

function Footer() {

  return (
      <footer>
          <div className={"text-center p-4"}>
            © 2022 Copyright:
            <a className="text-white" href="https://christophergs.com/">Recipe API - Better than all the REST</a>
          </div>
      </footer>
  );
}

export default Footer;
