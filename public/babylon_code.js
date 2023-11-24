const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to create the scene
const createScene = async () => {
    const scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.invertRotation = true;
    scene.camera = camera;

    // Create a light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    // Create videoDome with 180-degree stereoscopic side-by-side video
    var videoDome = new BABYLON.VideoDome(
        "videoDome",
        ["videos/video1.mp4"],
        {
            resolution: 32,
            clickToPlay: false,
            autoPlay: true,
            halfDomeMode: true
        },
        scene
    );

    videoDome.position = new BABYLON.Vector3(0, 1, 0);
    videoDome.videoMode = BABYLON.VideoDome.MODE_SIDEBYSIDE;

    // Create a simple Mesh as a wrapper for the VideoDome using MeshBuilder
    var videoDomeMesh = BABYLON.MeshBuilder.CreateSphere("videoDomeMesh", { diameter: 1000, segments: 32 }, scene);
    videoDomeMesh.isVisible = false;

    // Enable XR
    const xr = await scene.createDefaultXRExperienceAsync({floorMesh: [videoDomeMesh]});

    // Create UI
    var UIPlane = BABYLON.MeshBuilder.CreatePlane("UIPlane", {width: 10, height: 10});
    UIPlane.position = new BABYLON.Vector3(0.1, -1, 0);
    var UITexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(UIPlane);

    var makeButtons = function() {
        let videoBtn = BABYLON.GUI.Button.CreateSimpleButton("video1btn", "Video 1");
        videoBtn.top = "15px";
        videoBtn.left = "-400px";
        videoBtn.width = "200px";
        videoBtn.height = "100px";
        videoBtn.textBlock.scaleX = 3;
        videoBtn.textBlock.scaleY = 3;
        videoBtn.textBlock.color = "white";
        UITexture.addControl(videoBtn);
        videoBtn.onPointerClickObservable.add(() => {
            videoDome.videoTexture.updateURL("videos/video1.mp4");
        });

        let video2Btn = BABYLON.GUI.Button.CreateSimpleButton("video2btn", "Video 2");
        video2Btn.top = "15px";
        video2Btn.width = "200px";
        video2Btn.height = "100px";
        video2Btn.textBlock.scaleX = 3;
        video2Btn.textBlock.scaleY = 3;
        video2Btn.textBlock.color = "white";
        UITexture.addControl(video2Btn);
        video2Btn.onPointerClickObservable.add(() => {
            videoDome.videoTexture.updateURL("videos/video2.mp4");
        });

        let video3Btn = BABYLON.GUI.Button.CreateSimpleButton("video3btn", "Video 3");
        video3Btn.top = "15px";
        video3Btn.width = "200px";
        video3Btn.height = "100px";
        video3Btn.textBlock.scaleX = 3;
        video3Btn.textBlock.scaleY = 3;
        video3Btn.left = "400px";
        video3Btn.textBlock.color = "white";
        UITexture.addControl(video3Btn);
        video3Btn.onPointerClickObservable.add(() => {
            videoDome.videoTexture.updateURL("videos/video3.mp4");
        });
    }

    makeButtons();
    
    return scene;
}

// IIFE to handle async setup
(async () => {
    const scene = await createScene();

    engine.runRenderLoop(() => {
        scene.render();
    });
})();

// Handle resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize();
});