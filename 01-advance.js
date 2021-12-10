import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true }); // anitialias true 3차원 장면이 렌더링 될 때 계단현상 x
		renderer.setPixelRatio(window.devicePixelRatio); // pc는 1.5
		divContainer.appendChild(renderer.domElement); // div container 하위로 추가 (canvas타입)
		this._renderer = renderer;

		const scene = new THREE.Scene(); // scene 객체
		this._scene = scene;

		this._setupCamera(); // 카메라
		this._setupLight(); // 광원

		this._setupControls(); // control 정의
		this._setupVideo();

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_setupVideo() {
		const video = document.createElement("video");

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const constraints = {
				video: { width: 1280, height: 720 },
			};

			navigator.mediaDevices
				.getUserMedia(constraints)
				.then((stream) => {
					video.srcObject = stream;
					video.play();

					const videoTexture = new THREE.VideoTexture(video);
					this._videoTexture = videoTexture;

					this._setupModel(); // 모델
				})
				.catch(function (error) {
					console.error("카메라에 접근할 수 없습니다.", error);
				});
		} else {
			console.error("MediaDevices 인터페이스 사용 불가");
		}
	}

	_setupControls() {
		new OrbitControls(this._camera, this._divContainer); // 카메라 객체와 마우스 이벤트를 받는 DOM 요소
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

		camera.position.z = 2;
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}

	_setupModel() {
		const geometry = new THREE.BoxGeometry(1, 1, 1);

		const material = new THREE.MeshPhongMaterial({
			map: this._videoTexture,
		});

		const cube = new THREE.Mesh(geometry, material);
		this._scene.add(cube);
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.0005;
		// this._cube.rotation.x = time;
		// this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};

// three.js는 3차원 객체 Scene

// 모니터에 출력하는 Renderer

// Scene을 보는 시점 Camera

// Scene는 Light(광원), Mesh(object3D)

// Mesh 는 Geometry(형상), Material로 구성
