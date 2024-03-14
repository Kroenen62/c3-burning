import * as THREE from 'three';
import fireShader from './fire-shader';

export class Fire extends THREE.Mesh {
  [x: string]: any;
  constructor(fireTex: THREE.Texture, color?: THREE.Color | string | number) {
    const fireMaterial = new THREE.ShaderMaterial({
      defines: fireShader.defines,
      uniforms: THREE.UniformsUtils.clone(fireShader.uniforms),
      vertexShader: fireShader.vertexShader,
      fragmentShader: fireShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    // Initialize uniforms
    fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter;
    fireTex.wrapS = fireTex.wrapT = THREE.ClampToEdgeWrapping;

    fireMaterial.uniforms.fireTex.value = fireTex;
    fireMaterial.uniforms.color.value = new THREE.Color(color || 0xeeeeee);
    fireMaterial.uniforms.invModelMatrix.value = new THREE.Matrix4();
    fireMaterial.uniforms.scale.value = new THREE.Vector3(4, 4, 4);
    fireMaterial.uniforms.seed.value = Math.random() * 19.19;

    super(new THREE.BoxGeometry(1.0, 1.0, 1.0), fireMaterial);

    // Bind the update method to the instance
    this.update = this.update.bind(this);
  }

  update(time?: number): void {
    const invModelMatrix = this.material.uniforms.invModelMatrix.value;

    this.updateMatrixWorld();
    invModelMatrix.copy(this.matrixWorld).invert();

    if (time !== undefined) {
      this.material.uniforms.time.value = time;
    }

    this.material.uniforms.invModelMatrix.value = invModelMatrix;
    this.material.uniforms.scale.value.copy(this.scale);
  }
}
