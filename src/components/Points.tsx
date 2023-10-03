import React, { forwardRef } from 'react';
import { Color, TextureLoader } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import glow from 'textures/glow.png';

const VERTEX_SHADER = `
  attribute float size;
  attribute vec3 flareColor;
  varying vec3 vColor;

  void main() {
    vColor = flareColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform sampler2D pointTexture;
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(color * vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
  }
`

const flareTexture = new TextureLoader().load(glow)

const uniforms = {
  color: { value: new Color() },
  pointTexture: { value: flareTexture }
}

const Points = forwardRef<any>((props, ref) => (
  <points ref={ref} {...props}>
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={VERTEX_SHADER}
      fragmentShader={FRAGMENT_SHADER}
    />
  </points>
));

export default Points;