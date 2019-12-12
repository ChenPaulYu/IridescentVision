import * as THREE from 'three';

var Background = function (renderer, scene) {
    let ground, ambientLight, hemiLight
    let textureLoader = new THREE.TextureLoader()

    let bldgs  = [], debris = []
    let debrisIdealSet = []
        
    let asphaltTexture, bldgTexture
    let bldgColor = 0x242424, lightColor = 0x444444, skyColor = 0xaaaaaa,
        chunkSize = 100, chunksAtATime = 6, debrisPerChunk = 32, debrisMaxChunkAscend = 2,
        smBldgSize = 10, lgBldgSize = 12;

    const Debris = require('./background/debris').default;
    const Building = require('./background/building').default;

    this.scene = scene;

    this.speed = 0.5;
    this.fogDistance = 100;
    this.brightness  = 0.5  

    this.update = (camera, mesh) => {
        backgroundUpdate(camera, mesh)
    }
    
    this.disable = () => {
        this.scene.remove(ground);
        this.scene.remove(ambientLight);
        this.scene.remove(hemiLight);
        for (var i = 0; i < bldgs.length; i++) {
            this.scene.remove(bldgs[i].mesh)
        }

        for (var i = 0; i < debris.length; i++) {
            this.scene.remove(debris[i].mesh)
        }

    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function randomAngle() {
        return Math.floor(Math.random() * 360);
    }


    function cityGenerate(zMove) {

        return [
            // northwest
            new Building(-44, 4, -44 + zMove, lgBldgSize, 40, lgBldgSize, bldgColor, bldgTexture, 0, 35, -85),
            new Building(-56, -2, -32+ zMove, smBldgSize, 52, smBldgSize, bldgColor, bldgTexture, 15, 0, -12),
            new Building(-36, 0, -16 + zMove, lgBldgSize, 52, lgBldgSize, bldgColor, bldgTexture, 0, 0, -10),
            new Building(-24, 0, -36 + zMove, smBldgSize, 52, smBldgSize, bldgColor, bldgTexture, 0, 0, -10),
            new Building(-16, 0, -20 + zMove, smBldgSize, 52, smBldgSize, bldgColor, bldgTexture, 30, 0, 0),

            // northeast
            new Building(24, -2, -44 + zMove, lgBldgSize, 44, lgBldgSize, bldgColor, bldgTexture, -15, 0, 15),
            new Building(40, 0, -36 + zMove, smBldgSize, 48, smBldgSize, bldgColor, bldgTexture ,   0, 0, 15),
            new Building(48, 0, -36 + zMove, smBldgSize, 38, smBldgSize, bldgColor, bldgTexture ,   0, 0, 12),
            new Building(20, 0, -24 + zMove, smBldgSize, 40, smBldgSize, bldgColor, bldgTexture ,   0, 0, 15),
            new Building(32, 0, -24 + zMove, smBldgSize, 48, smBldgSize, bldgColor, bldgTexture ,   0, 0, 15),
            new Building(42, 0, -24 + zMove, smBldgSize, 38, smBldgSize, bldgColor, bldgTexture ,   0, 0, 15),
            new Building(48, 2, 1 + zMove, lgBldgSize, 32, lgBldgSize, bldgColor, bldgTexture   ,   0, -25, 80),

            // southwest
            new Building(-48, 0, 16 + zMove, smBldgSize, 44, smBldgSize, bldgColor, bldgTexture, 0, 0, -10),
            new Building(-32, 0, 16 + zMove, smBldgSize, 48, smBldgSize, bldgColor, bldgTexture, 0, 0, -15),
            new Building(-16, -2, 16 + zMove, smBldgSize, 40, smBldgSize, bldgColor, bldgTexture, -10, 0, -12),
            new Building(-32, 0, 32 + zMove, lgBldgSize, 48, lgBldgSize, bldgColor, bldgTexture,  0, 0, 15),
            new Building(-48, 0, 48 + zMove, smBldgSize, 20, smBldgSize, bldgColor, bldgTexture),
            new Building(-16, 0, 48 + zMove, smBldgSize, 36, smBldgSize, bldgColor, bldgTexture,  0, 0, 15),
            new Building(-48, 19, 48 + zMove, smBldgSize, 20, smBldgSize, bldgColor, bldgTexture, 0, 0, -15),

            // southeast
            new Building(30, 0, 52 + zMove, lgBldgSize, 48, lgBldgSize, bldgColor, bldgTexture,  0, 0, 20),
            new Building(24, 0, 20 + zMove, smBldgSize, 40, smBldgSize, bldgColor, bldgTexture,  0, 0, 5),
            new Building(40, 0, 24 + zMove, smBldgSize, 40, smBldgSize, bldgColor, bldgTexture),
            new Building(24, 0, 32 + zMove, smBldgSize, 36, smBldgSize, bldgColor, bldgTexture),
            new Building(52, 0, 12 + zMove, smBldgSize, 20, smBldgSize, bldgColor, bldgTexture),
            new Building(36, 0, 32 + zMove, lgBldgSize, 48, lgBldgSize, bldgColor, bldgTexture, 0, 0, -25)
        ];
    }

    function debrisGenerate(zMove) {
        debrisIdealSet = []
        debris = []
        for (var d = 0; d < debrisPerChunk; ++d) {
            let halfChunk = chunkSize / 2,
                debrisParams = {
                    x: randomInt(-halfChunk, halfChunk),
                    y: randomInt(0, chunkSize * debrisMaxChunkAscend),
                    z: randomInt(-halfChunk, halfChunk)
                };
            debrisParams.size = Math.abs(debrisParams.x / halfChunk) * 6;
            debrisParams.height = debrisParams.size * randomInt(2, 3);

            debrisIdealSet.push({
                x: debrisParams.x,
                y: debrisParams.y,
                z: debrisParams.z,

                width: debrisParams.size,
                height: debrisParams.height,
                depth: debrisParams.size,

                rotX: randomAngle(),
                rotY: randomAngle(),
                rotZ: randomAngle()
            });
        }

        for (var fs of debrisIdealSet)
            debris.push(new Debris(
                fs.x,
                fs.y,
                fs.z + zMove,
                fs.width,
                fs.height,
                fs.depth,
                fs.rotX,
                fs.rotY,
                fs.rotZ,
                bldgColor,
                scene
            ));

        return debris
    }

    let lightGenerate = (lightColor, brightness) => {

        ambientLight = new THREE.AmbientLight(lightColor);
        this.scene.add(ambientLight);

        hemiLight = new THREE.HemisphereLight(lightColor, 0xffffff, brightness);
        hemiLight.position.set(0, 8, 0);
        this.scene.add(hemiLight);
    }

    let floorGenerate = (chunkSize, asphaltTexture, zMove) => {
        var groundGeo = new THREE.PlaneGeometry(chunkSize, chunkSize),
            groundMat = new THREE.MeshLambertMaterial({
                color: 0x969696,
                map: asphaltTexture
            });
        ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -0.5 * Math.PI;
        ground.position.set(0, 0, zMove);
        ground.receiveShadow = true;
        return ground
    }


    let backgroundGenerate = (chunkSize, chunksAtATime, asphaltTexture) => {
        for (var cz = 1; cz > -chunksAtATime; --cz) {
            var zMove = chunkSize * cz;

            ground = floorGenerate(chunkSize, asphaltTexture, zMove)
            bldgs  = cityGenerate(zMove)
            debris = debrisGenerate(zMove)

            for(var i =0;i < bldgs.length;i++) {
                this.scene.add(bldgs[i].mesh)
            }

            for (var i = 0; i < debris.length; i++) {
                this.scene.add(debris[i].mesh)
            }

            // this.scene.add(ground);

            
        }
    }

    let backgroundUpdate = (camera, mesh) => {
        let delta = camera.position.z > chunkSize ? -chunkSize : this.speed;
        camera.position.z += delta
        mesh.position.z   += delta

        for (var d of debris) {
            if (d.mesh.position.y >= chunkSize * debrisMaxChunkAscend)
                d.mesh.position.y += -chunkSize * debrisMaxChunkAscend;
            else
                d.mesh.position.y += this.speed;

            let angleToAdd = this.speed / chunkSize * (Math.PI * 2);
            d.mesh.rotation.x += d.mesh.rotation.x >= Math.PI * 2 ? -Math.PI * 2 : angleToAdd;
            d.mesh.rotation.y += d.mesh.rotation.y >= Math.PI * 2 ? -Math.PI * 2 : angleToAdd;
            d.mesh.rotation.z += d.mesh.rotation.z >= Math.PI * 2 ? -Math.PI * 2 : angleToAdd;
        }
    }

    let initBackground = (renderer) => {
        asphaltTexture = textureLoader.load("https://i.ibb.co/hVK82BH/asphalt-texture.jpg");
        bldgTexture = textureLoader.load("https://i.ibb.co/ZGLhtGv/building-texture.jpg");

        renderer.setClearColor(new THREE.Color(skyColor));
        renderer.shadowMap.enabled = true;
        backgroundGenerate(chunkSize, chunksAtATime, asphaltTexture)
        lightGenerate = (lightColor, this.brightness)
        this.scene.fog = new THREE.Fog(skyColor, 0.01, this.dfogDistance);

    }

    initBackground(renderer, scene)

}

export { Background };