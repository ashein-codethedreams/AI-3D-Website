/* eslint-disable react/prop-types, react/no-unknown-property */
import { Suspense, useEffect, useMemo } from "react";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import {
    ContactShadows,
    Decal,
    Center,
    OrbitControls,
    useGLTF,
    useTexture,
} from "@react-three/drei";
import * as THREE from "three";

function Shirt({ color, decal, decalType }) {
    const { nodes, materials } = useGLTF("/shirt_baked.glb");
    const shirtMaterial = useMemo(() => {
        const material = materials.lambert1.clone();
        material.color = new THREE.Color(color);
        material.roughness = 0.8;
        return material;
    }, [color, materials.lambert1]);
    useEffect(() => () => shirtMaterial.dispose(), [shirtMaterial]);

    return (
        <Center>
            <mesh
                castShadow
                geometry={nodes.T_Shirt_male.geometry}
                material={shirtMaterial}
                scale={2}
                dispose={null}
            >
                {decal && <Artwork decal={decal} decalType={decalType} />}
            </mesh>
        </Center>
    );
}

function Artwork({ decal, decalType }) {
    const texture = useTexture(decal);
    texture.colorSpace = THREE.SRGBColorSpace;

    return (
        <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={decalType === "full" ? 0.55 : 0.22}
            map={texture}
            depthTest={false}
            depthWrite
        />
    );
}

function LoadingShirt() {
    return (
        <mesh>
            <boxGeometry args={[1, 1.4, 0.15]} />
            <meshStandardMaterial color="#e6e3dc" wireframe />
        </mesh>
    );
}

const Canvas = ({ design }) => (
    <div className="canvas-wrap">
        <ThreeCanvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 4.8], fov: 34 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            aria-label="Interactive 3D preview of your custom T-shirt"
        >
            <ambientLight intensity={1.1} />
            <directionalLight
                position={[2.5, 4, 4]}
                intensity={2.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <directionalLight position={[-3, 1, -2]} intensity={1.1} />
            <Suspense fallback={<LoadingShirt />}>
                <Shirt
                    color={design.color}
                    decal={design.decal}
                    decalType={design.decalType}
                />
            </Suspense>
            <ContactShadows
                position={[0, -1.15, 0]}
                opacity={0.22}
                scale={5}
                blur={2.5}
                far={3}
            />
            <OrbitControls
                makeDefault
                enablePan={false}
                minDistance={3.2}
                maxDistance={6.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.8}
            />
        </ThreeCanvas>
        <div className="canvas-hint">
            <span aria-hidden="true">↻</span> DRAG TO EXPLORE
        </div>
    </div>
);

useGLTF.preload("/shirt_baked.glb");

export default Canvas;
