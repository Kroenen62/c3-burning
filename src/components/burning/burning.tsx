import { Component, Element, Prop, h } from '@stencil/core';
import { Fire } from '../../utils/fire'; // Assurez-vous que le chemin d'accès est correct
import * as THREE from 'three';

@Component({
  tag: 'c3-burning',
  styleUrl: 'burning.css',
  shadow: true,
})
export class Burning {
  @Prop() width: number = 300;
  @Prop() height: number = this.width * 0.5;
  @Prop() bgColor: number = 0xffffff;
  @Element() el: HTMLElement;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private fire: Fire;

  componentDidLoad() {
    this.initThreeJS();
  }

  initThreeJS() {
    this.scene = new THREE.Scene();
    const width = this.width;
    const height =  this.height;

    this.scene.background = new THREE.Color(this.bgColor);
    
    // Créer une caméra
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.left = -width;
    this.camera.right = width;
    this.camera.top = height;
    this.camera.bottom = -height;

    // Créer un rendu
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.el.shadowRoot.appendChild(this.renderer.domElement);

    // Charger une texture de feu
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load("assets/Fire.png");

    // Créer un feu
    this.fire = new Fire(tex);
    this.fire.scale.set(3, 3, 1);

    this.scene.add(this.fire);

    // Positionner la caméra
    this.camera.position.z = 3;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      this.fire.update(performance.now() / 1000);
      this.renderer.render( this.scene, this.camera );
    }
    animate();
  }

  disconnectedCallback() {
    this.el.shadowRoot.querySelector('canvas').remove();

    this.renderer.dispose();
    this.fire.geometry.dispose();
    this.fire.material.dispose();

    this.renderer = null;
    this.fire = null;

    this.scene.dispose();
    this.scene = null;

    this.camera = null;
  }

  render() {
    return <div></div>;
  }

}
