export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-mark">PB</div>
              <div className="logo-text">
                PAK BOLAN<span>INTERNATIONAL</span>
              </div>
            </div>
            <p>Connecting talent with global opportunities.</p>
          </div>
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#vacancies">Vacancies</a></li>
              <li><a href="#apply">Apply</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>More</h5>
            <ul>
              <li><a href="#employers">Employers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li>Sardar M Ishaq Khan<br />0302-8202273</li>
              <li>Sardar M Ishaq Khan<br />0300-0300262</li>
              <li>Muhammad Shakeel Khan<br />0300-8202273</li>
              <li>pakbolanintl.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} PAK BOLAN INTERNATIONAL. All Rights Reserved.</span>
          <span>Overseas Employment Promoters — Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
