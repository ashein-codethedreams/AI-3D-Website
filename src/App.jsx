import { useState } from "react";
import Canvas from "./canvas";
import { downloadCanvasToImage } from "./config/helpers";
import Customizer from "./pages/Customizer";
import Home from "./pages/Home";

const initialDesign = {
    color: "#f5f3ee",
    decal: null,
    decalType: "logo",
};

function App() {
    const [design, setDesign] = useState(initialDesign);
    const [exportError, setExportError] = useState("");

    const updateDesign = (updates) => {
        setDesign((current) => ({ ...current, ...updates }));
    };

    const resetDesign = () => setDesign(initialDesign);
    const exportDesign = () => {
        try {
            downloadCanvasToImage();
            setExportError("");
        } catch (error) {
            setExportError(
                error.message ||
                    "The preview could not be exported. Please try again.",
            );
        }
    };

    return (
        <main className="app">
            <Home onReset={resetDesign} />
            <section className="studio" aria-label="3D T-shirt design studio">
                <div className="preview">
                    <div className="preview-heading">
                        <div>
                            <span className="eyebrow">YOUR CANVAS</span>
                            <h1>Make it yours.</h1>
                        </div>
                        <div className="preview-actions">
                            <span className="preview-status">
                                <span className="status-dot" />
                                LIVE PREVIEW
                            </span>
                            <button
                                className="export-button"
                                type="button"
                                onClick={exportDesign}
                            >
                                Export <span aria-hidden="true">↓</span>
                            </button>
                        </div>
                    </div>
                    <Canvas design={design} />
                    {exportError && (
                        <p className="export-error" role="alert">
                            {exportError}
                        </p>
                    )}
                    <div className="preview-caption">
                        <span>
                            01 <span className="caption-divider">/</span> THE
                            EVERYDAY TEE
                        </span>
                        <span>
                            DRAG TO ROTATE <span aria-hidden="true">↗</span>
                        </span>
                    </div>
                </div>
                <Customizer design={design} updateDesign={updateDesign} />
            </section>
            <footer className="site-footer">
                <span>DESIGNED WITH A LITTLE HELP FROM AI</span>
                <span>
                    GOOD IDEAS LOOK GOOD ON YOU{" "}
                    <span aria-hidden="true">✳</span>
                </span>
            </footer>
        </main>
    );
}

export default App;
