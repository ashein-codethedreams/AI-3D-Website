/* eslint-disable react/prop-types */
const Home = ({ onReset }) => (
    <header className="topbar">
        <a className="brand" href="/" aria-label="Form Studio home">
            <span className="brand-mark" aria-hidden="true">
                <span />
                <span />
                <span />
            </span>
            <span>
                form<span className="brand-period">.</span>
            </span>
            <span className="brand-divider" />
            <span className="brand-caption">AI DESIGN STUDIO</span>
        </a>
        <div className="topbar-right">
            <span className="saved-indicator">
                <span /> LIVE SESSION
            </span>
            <button className="reset-button" type="button" onClick={onReset}>
                Start over <span aria-hidden="true">↗</span>
            </button>
        </div>
    </header>
);

export default Home;
