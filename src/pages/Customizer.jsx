/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import config from "../config/config";
import { reader } from "../config/helpers";

const colors = [
    { name: "Chalk", value: "#f5f3ee" },
    { name: "Ink", value: "#282b2a" },
    { name: "Moss", value: "#657567" },
    { name: "Clay", value: "#c87858" },
    { name: "Butter", value: "#e4c985" },
    { name: "Sky", value: "#9db5c1" },
];

const Customizer = ({ design, updateDesign }) => {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const fileInput = useRef(null);

    const generateDesign = async (event) => {
        event.preventDefault();
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt || isGenerating) return;

        setIsGenerating(true);
        setError("");

        try {
            const environment = import.meta.env.PROD
                ? config.production
                : config.development;
            const response = await fetch(environment.backendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: trimmedPrompt }),
            });

            if (!response.ok) {
                throw new Error(
                    `Design generation failed (${response.status}). Please try again.`,
                );
            }

            const result = await response.json();
            const image = result.photo || result.image || result.imageUrl;
            if (typeof image !== "string" || !image) {
                throw new Error(
                    "The design service returned no image. Please try again.",
                );
            }

            updateDesign({ decal: image });
        } catch (generationError) {
            setError(
                generationError instanceof TypeError
                    ? "We couldn't reach the AI design service. Check your connection and try again."
                    : generationError.message ||
                          "Could not generate a design. Please try again.",
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const uploadDesign = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        event.target.value = "";

        if (!file.type.startsWith("image/")) {
            setError("Choose an image file to add it to your T-shirt.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("That image is over 10 MB. Choose a smaller file.");
            return;
        }

        try {
            setError("");
            const image = await reader(file);
            updateDesign({ decal: image });
        } catch {
            setError("We couldn't read that image. Please try another file.");
        }
    };

    return (
        <aside className="customizer" aria-label="Customize your T-shirt">
            <div className="panel-intro">
                <span className="eyebrow">
                    THE EVERYDAY TEE{" "}
                    <span className="product-number">№ 01</span>
                </span>
                <h2>
                    A blank canvas
                    <br />
                    for your next idea.
                </h2>
                <p>Make something that feels like you.</p>
            </div>

            <section
                className="control-section color-section"
                aria-labelledby="color-title"
            >
                <div className="section-heading">
                    <h3 id="color-title">
                        01 <span>Color</span>
                    </h3>
                    <span className="selected-color">
                        {colors.find((color) => color.value === design.color)
                            ?.name || "Custom"}
                    </span>
                </div>
                <div className="color-swatches">
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            className={`color-swatch${design.color === color.value ? " is-selected" : ""}`}
                            style={{ "--swatch-color": color.value }}
                            type="button"
                            aria-label={`${color.name} shirt color`}
                            aria-pressed={design.color === color.value}
                            onClick={() => updateDesign({ color: color.value })}
                        />
                    ))}
                </div>
            </section>

            <section
                className="control-section design-section"
                aria-labelledby="design-title"
            >
                <div className="section-heading">
                    <h3 id="design-title">
                        02 <span>Your artwork</span>
                    </h3>
                    <span className="optional-label">OPTIONAL</span>
                </div>
                <div
                    className="placement-toggle"
                    aria-label="Artwork placement"
                >
                    <button
                        type="button"
                        className={
                            design.decalType === "logo" ? "is-active" : ""
                        }
                        aria-pressed={design.decalType === "logo"}
                        onClick={() => updateDesign({ decalType: "logo" })}
                    >
                        Chest print
                    </button>
                    <button
                        type="button"
                        className={
                            design.decalType === "full" ? "is-active" : ""
                        }
                        aria-pressed={design.decalType === "full"}
                        onClick={() => updateDesign({ decalType: "full" })}
                    >
                        Statement
                    </button>
                </div>
                <button
                    className={`upload-button${design.decal ? " has-artwork" : ""}`}
                    type="button"
                    onClick={() => fileInput.current?.click()}
                >
                    <span className="upload-icon" aria-hidden="true">
                        {design.decal ? "↻" : "+"}
                    </span>
                    <span>
                        {design.decal
                            ? "Replace your artwork"
                            : "Upload your own artwork"}
                    </span>
                    <span className="upload-arrow" aria-hidden="true">
                        ↗
                    </span>
                </button>
                <input
                    ref={fileInput}
                    className="visually-hidden"
                    type="file"
                    accept="image/*"
                    onChange={uploadDesign}
                    aria-label="Upload artwork image"
                />
            </section>

            <section className="ai-section" aria-labelledby="ai-title">
                <div className="ai-heading">
                    <span className="ai-spark" aria-hidden="true">
                        ✳
                    </span>
                    <div>
                        <span className="eyebrow">A LITTLE MAGIC</span>
                        <h3 id="ai-title">Dream it. Wear it.</h3>
                    </div>
                </div>
                <form onSubmit={generateDesign}>
                    <label className="visually-hidden" htmlFor="design-prompt">
                        Describe your design
                    </label>
                    <textarea
                        id="design-prompt"
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder="A tiny sun rising over a mountain..."
                        maxLength={500}
                        rows={3}
                    />
                    <div className="prompt-footer">
                        <span>Be as imaginative as you like.</span>
                        <span>{prompt.length}/500</span>
                    </div>
                    <button
                        className="generate-button"
                        type="submit"
                        disabled={!prompt.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <span
                                    className="button-spinner"
                                    aria-hidden="true"
                                />{" "}
                                Dreaming up your design...
                            </>
                        ) : (
                            <>
                                Generate with AI{" "}
                                <span aria-hidden="true">↗</span>
                            </>
                        )}
                    </button>
                </form>
                <p className="ai-footnote">
                    Your idea, illustrated by AI. It may take a few seconds.
                </p>
            </section>

            {error && (
                <p className="error-message" role="alert">
                    {error}
                </p>
            )}
            {design.decal && (
                <button
                    className="remove-artwork"
                    type="button"
                    onClick={() => updateDesign({ decal: null })}
                >
                    Remove artwork <span aria-hidden="true">×</span>
                </button>
            )}
        </aside>
    );
};

export default Customizer;
