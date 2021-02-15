import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

import { buildAttributes, setAttributes, positionToArray } from 'utils/geometry'
import { System } from 'models/universe'

import Points from './Points'

const clockWarparound = 60 * 60 * 1000
const twinkleSpeed = 0.85

type Props = {
  solarSystems: System[];
}

const Stars = ({ solarSystems }: Props) => {

  const pointsRef = useRef(null)
  const clockTime = useRef(0)

  useFrame((_, delta) => {
    clockTime.current = (clockTime.current + delta) % clockWarparound;

    if (!pointsRef.current) {
      return;
    }

    const colorMaxSec = new THREE.Color('#39b4f1');

    const count = solarSystems.length;

    const { positions, colors, scales } = buildAttributes(count);

    for (let index = 0; index < count; index++) {
      const solarSystem = solarSystems[index];

      positionToArray(solarSystem, positions, index);

      const twikleScale = THREE.MathUtils.clamp(
        -1 + Math.sin((clockTime.current + index) * twinkleSpeed) * 2,
        0,
        1
      );

      new THREE.Color('#a1a1a1').lerp(
        colorMaxSec, solarSystem.security
      ).addScalar(
        twikleScale
      ).toArray(colors, index * 3)

      scales[index] = 2.0 * (solarSystem.radius / 1000000000000);
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales);
  })

  return (
    <Points ref={pointsRef} />
  );
}

export default Stars