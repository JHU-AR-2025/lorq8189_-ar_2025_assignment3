/*
Based Playground : 
https://playground.babylonjs.com/#KNE0O#84
*/

var camera;

var createScene = async function () {
    var scene = new BABYLON.Scene(engine);

    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 100, 100), scene);
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 50, new BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var ground = BABYLON.Mesh.CreateGround("ground", 500, 500, 10, scene);

    function isGround(mesh) {
        return mesh === ground;
    }


    const { meshes, animationGroups } = await BABYLON.SceneLoader.ImportMeshAsync(
        "",                                            
        "https://assets.babylonjs.com/meshes/",        
        "SheenChair.glb",                              
        scene
    );
    const model = meshes[0];
    const group = new BABYLON.TransformNode("modelRoot", scene);
    meshes.forEach(m => { if (m.parent == null) m.parent = group; });
    group.scaling.setAll(10);    
                    
    model.position.set(0, 0, 1);                       



    var box = BABYLON.Mesh.CreateBox("box", 4.0, scene);
    box.position.y = 2;
    box.scaling.z = 2;
    var matBox = new BABYLON.StandardMaterial("matBox", scene);
    matBox.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);
    box.material = matBox;
    box.isPickable = true;
    console.log(box.position);

    var box2 = BABYLON.Mesh.CreateBox("box2", 8.0, scene);
    box2.position = new BABYLON.Vector3(-20, 4, 0);
    var matBox2 = new BABYLON.StandardMaterial("matBox2", scene);
    matBox2.diffuseColor = new BABYLON.Color3(0.1, 0.1, 1);
    box2.material = matBox2;




    // XR
    const xrHelper = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [ground]
    });

    let mesh;

    xrHelper.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handness === 'right') {
                const xr_ids = motionController.getComponentIds();
                let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
                triggerComponent.onButtonStateChangedObservable.add(() => {
                    if (triggerComponent.changes.pressed) {
                        if (triggerComponent.pressed) {


                            const origin  = controller.pointer.getAbsolutePosition();
                            const forward = controller.pointer.getDirection(BABYLON.Axis.Z);
                            const ray = new BABYLON.Ray(origin, forward, 100);
                            const groundOnlyFilter = (mesh) => mesh === ground; 
                            
                            const pick = scene.pickWithRay(ray, isGround);
                            if (!pick || !pick.hit) return;
                            group.position.copyFrom(pick.pickedPoint);

                            


                        }
                    }
                });
            }
        })
    });


    return scene;
}
