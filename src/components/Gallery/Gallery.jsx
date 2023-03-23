import React, { useRef } from 'react'
import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, extend } from '@react-three/fiber'
import glsl from 'babel-plugin-glsl/macro'
import * as THREE from 'three'

const ColorShiftMaterial = shaderMaterial(
    { uTime: 0, uColorStart: new THREE.Color('#686868'), uColorEnd: new THREE.Color('#4B4B4B') },
    glsl`
varying vec2 vUv;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vUv = uv;
}`,
    glsl`
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl) 
uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;
varying vec2 vUv;
void main() {
    vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, uTime * 0.1));
    float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
    float outerGlow = distance(vUv, vec2(0.5)) * 4.0 - 1.4;
    strength += outerGlow;
    strength += step(-0.2, strength) * 0.8;
    strength = clamp(strength, 0.0, 1.0);
    vec3 color = mix(uColorStart, uColorEnd, strength);
    gl_FragColor = vec4(color, 1.0);
}`,
)
extend({ ColorShiftMaterial })

export const Gallery = ({ modele }) => {
    //le shader est appliqué sur le mesh
    modele.scene.children[0].children[0].children[0].children[0].children[0].material = new ColorShiftMaterial()
    useFrame((state, delta) => { (modele.scene.children[0].children[0].children[0].children[0].children[0].material.uTime += delta) })
    return (
        <>
            <primitive
                object={modele.scene}
                scale={1}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                onCreated={() => {
                    console.log("event");
                }}
                onClick={(event) => {
                    // console.log(event.object.name)
                    // console.log(event.eventObject)
                    // console.log(event.object)
                    // event.stopPropagation()
                }}
            />
        </>
    )
}