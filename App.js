import { StatusBar } from 'expo-status-bar';
import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const util = require('util');

class App extends React.Component  {

  constructor(){
    super();

    this.state ={
      variTR:'',
      angulo1:'',
      angulo2:'',
      variTRS2:'',
      angulo1S2:'',
      angulo2S2:'',
      tPromedio_1:0,
      tPromedio_2:0,
      countMsgs_1:0,
      countMsgs_2:0,
      tHTTP_1:'',
      tHTTP_2:'',
    }

  }

  componentDidMount(){

    console.log("Iniciando aplicación");
    this.ciclo();
    this.ciclo2();
    this.medirtiempo();

  }

  medirtiempo(){

    const that =this;
    var countP1 = 0;
    var countP2 = 0;

    async function AsyncTomarMedidas (){

      function medidas(){

          that.state.tPromedio_1=(that.state.tPromedio_1*(countP1)+that.state.tHTTP_1)/(countP1+1);
          that.state.tPromedio_2=(that.state.tPromedio_2*(countP2)+that.state.tHTTP_2)/(countP2+1);

          countP1 = countP1 + 1;
          countP2 = countP2 + 1;

          setTimeout(medidas, 20);
      }

      await medidas();
    }
    
    AsyncTomarMedidas();
    
  }

  ciclo(){

    var continua="iniciada";
    const that =this;
    var start = new Date ();
    var end = new Date ();

    function funcpromes(){
      const controller = new AbortController();
      const signal = controller.signal;
      setTimeout(() => controller.abort(), 200);

      const that2=that;
      fetch("http://192.168.0.19:80",{signal})
      .then(res => res.text())
      .then(data => {
            end = new Date ();
            var arrayAngulos = data.split(",");

            that2.setState({
              variTR:data,
              angulo1:arrayAngulos[0],
              angulo2:arrayAngulos[1],
              tHTTP_1: (end-start),
              countMsgs_1: that2.state.countMsgs_1+1,
            });
            start = new Date ();
            setTimeout(funcpromes, 1);
          }).catch(err =>{
            if (err.name === 'AbortError') {
              console.log('Fetch 1 abortado');
              setTimeout(funcpromes, 1);
            } else {
              console.error('Uh oh, error fetch inesperado!', err);
            }
          });
      
     // console.log(that2.state.variTR)
      
    }
    const promes = util.promisify(funcpromes);
    promes()

  }


  ciclo2(){

    var continua="iniciada";
    const that =this;
    var start = new Date ();
    var end = new Date ();

    function funcpromes(){
      const controller = new AbortController();
      const signal = controller.signal;
      setTimeout(() => controller.abort(), 200);

      const that2=that;

      fetch("http://192.168.0.15:80",{signal})
      .then(res => res.text())
      .then(data => {
            end = new Date ();
            var arrayAngulos = data.split(",");

            that2.setState({
              variTRS2:data,
              angulo1S2:arrayAngulos[0],
              angulo2S2:arrayAngulos[1],
              tHTTP_2: (end-start),
              countMsgs_2: that2.state.countMsgs_2+1,
            });
            start = new Date ();
            setTimeout(funcpromes, 1);
          }).catch(err =>{
            if (err.name === 'AbortError') {
              console.log('Fetch 2 abortado');
              setTimeout(funcpromes, 1);
            } else {
              console.error('Uh oh, error fetch inesperado!', err);
            }
          });
      
     // console.log(that2.state.variTR)
      
    }
    const promes = util.promisify(funcpromes);
    promes()

  }

  

  render(){

    // var arrayAngulos = this.state.variTR.split(",");

    // var rot = parseFloat(arrayAngulos[0], 10);
    // var rot2 = parseFloat(arrayAngulos[1], 10);

    // if (isNaN(rot)) {
    //   rot = 0;
    // }

  
    var titulo = "APP 2.0 IMU SYSTEM";
    var tpromedio1 = "Sensor 1: "+Math.trunc(this.state.tPromedio_1)+"ms";
    var tpromedio2 = "Sensor 2: "+Math.trunc(this.state.tPromedio_2)+"ms";


    return (
      <>

        <View style ={styles.grancontainer}>

          <View style ={styles.container}>
              <Text style={styles.sectionTitle}>{titulo}</Text>
          </View>
        
              

            <View style={styles.subcontainer}>
                <Text style={styles.engine}>Desarrollo softwarte con: React-Native</Text>
                <Text style={styles.engine}>Graficos 3D framwork: Three.js</Text>
                <Text style={styles.engine}>API motor 3d: OpenGL</Text>
                <Text style={{marginTop: 5,marginBottom: 10,left: 10, fontSize: 15,color: "#763895",fontWeight: "bold",}}>Conectividad modular: TCP IP</Text>
            </View>
        </View>
 
        <GraphicsView
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
        />
        
        <View>
          <View style={{justifyContent: "center"}}>
             <Text style={{textAlign: 'center',marginBottom:5}}>LATENCIA PROMEDIO</Text> 
          </View>
          <View style={styles.colContenedor}>
              <View style ={styles.col}>
                  <Text style={styles.engine}>{tpromedio1}</Text>
              </View>

              <View style={{width:"5%"}}>
              </View>

              <View style ={styles.col2}>
                  <Text style={styles.engine}>{tpromedio2}</Text>
              </View>

          </View>
        </View>
    

      </>
    );
  }


  onContextCreate = async ({
    gl,
    canvas,
    width,
    height,
    scale: pixelRatio,
  }) => {

    this.renderer = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });
    //this.renderer.setClearColor(0x5f5f55)
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 3.5;
    this.camera.position.x = 2.5;
    this.camera.position.y = 0.5;
    //this.camera.position.y = 5;
    //this.camera.rotation.x = -90/57.2958;

    // creamos un cubo de ejemplo
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });
    this.cube = new THREE.Mesh(geometry, material);
    //--------

    //punto de rotaciòn del cubo de ejemplo
    this.cubePivot = new THREE.Object3D();
    //this.cube.position.x = 0.5;
    //this.cubePivot.add(this.cube);

    //this.scene.add(this.cube);
    //--

    //luces
    //this.scene.add(new THREE.AmbientLight(0xFB9B83));
    this.scene.add(new THREE.AmbientLightProbe());
    const light = new THREE.DirectionalLight(0xCDF3E1, 0.2);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    //---------------

    this.manocontenedor = new THREE.Object3D();
    //this.scene.add(this.manocontenedor);

    this.antebrazoContenedor = new THREE.Object3D();
    this.scene.add(this.antebrazoContenedor);

    await this.loadModel();

  };


  loadModel = async () => {

    const modelMano = {
            'manoOb.obj': require('./modelos/mano.obj'),
            'manoOb.mtl': require('./modelos/mano.mtl'),
            //'thomas.png': require('./thomas/thomas.png'),
          };
    /// Load model!
    const meshMano = await ExpoTHREE.loadAsync(
      [modelMano['manoOb.obj'], modelMano['manoOb.mtl']],
      null,
      modelMano,
    );

    /// Update size and position
    ExpoTHREE.utils.scaleLongestSideToSize(meshMano, 3);
    ExpoTHREE.utils.alignMesh(meshMano, { y: 0.35, x:1});
    /// Smooth mesh
    // ExpoTHREE.utils.computeMeshNormals(mesh);
    this.manocontenedor.add(meshMano);
    this.manocontenedor.position.x=(2.4);
    this.scene.add(this.manocontenedor);

    const modelAntebrazo = {
      'antebrazoOb.obj': require('./modelos/antebrazo.obj'),
      'antebrazoOb.mtl': require('./modelos/antebrazo.mtl'),
      //'thomas.png': require('./thomas/thomas.png'),
    };
    
    /// Load model!
    const meshAntebrazo = await ExpoTHREE.loadAsync(
    [modelAntebrazo['antebrazoOb.obj'], modelAntebrazo['antebrazoOb.mtl']],
    null,
    modelAntebrazo,
    );

    /// Update size and position
    ExpoTHREE.utils.scaleLongestSideToSize(meshAntebrazo, 3);
    ExpoTHREE.utils.alignMesh(meshAntebrazo, { y: 0.35, x:0.9});
    /// Smooth mesh
    // ExpoTHREE.utils.computeMeshNormals(mesh);

    this.antebrazoContenedor.add(meshAntebrazo);
    //this.antebrazoContenedor.add(this.manocontenedor);
    

    //this.cube.position.x=this.antebrazoContenedor.position.x;
    //this.cube.position.y=this.antebrazoContenedor.position.y;
  
    this.anguloEM=0;
  
  };

  

  onRender = delta => {
    
    if (this.anguloEM + delta*240/57.2958 < (this.state.angulo1S2)/57.2958){
      this.anguloEM += delta*240/57.2958;
    }

    if (this.anguloEM - delta*240/57.2958 > (this.state.angulo1S2)/57.2958){
      this.anguloEM -= delta*240/57.2958;
    }

    this.antebrazoContenedor.rotation.z = this.anguloEM;
    this.manocontenedor.position.y = Math.sin(this.anguloEM)*2.4;
    this.manocontenedor.position.x = Math.cos(this.anguloEM)*2.4;

    this.manocontenedor.rotation.z = (this.state.angulo1)/57.2958;
    this.manocontenedor.rotation.x = (this.state.angulo2)/57.2958;

    //this.manocontenedor.rotation.x += 3.5*delta;
    //this.manocontenedor.rotation.x = (this.state.angulo2-this.state.angulo2S2)/57.2958;
    //this.antebrazoContenedor.rotation.z = (this.state.angulo1S2)/57.2958;
    //this.antebrazoContenedor.rotation.x = (this.state.angulo2S2)/57.2958;
    
    //this.cubePivot.rotation.x = (this.state.angulo2+9)/57.2958;
    //this.cubePivot.rotation.z = (rot)/57.2958;
    //this.cubePivot.rotation.x = (rot2)/57.2958;
    this.renderer.render(this.scene, this.camera);

    this.anterior = this.actual;
  };
  
}

const styles = StyleSheet.create({

  grancontainer:{
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //width: "50%"
  },
  container: {
    width: "80%",
    marginTop: 40,
    backgroundColor: "#35B1C4",
    borderRadius:10,
    borderWidth:3,
    borderColor: "#35B1C4",
    //justifyContent: "center",
  },
  colContenedor: {
    flexDirection: "row",
    //paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 30,
  },

  col:{
    width: "40%",
    paddingHorizontal: 5,
    backgroundColor: "#32DBD2",
    borderRadius:6,
    borderWidth:3,
    borderColor: "#32DBD2",
  },
  col2:{
    width: "40%",
    paddingHorizontal: 5,
    backgroundColor: "#35B1C4",
    borderRadius:6,
    borderWidth:3,
    borderColor: "#35B1C4",
  },

  sectionTitle: {
    //left: 50,
    //justifyContent: "center",
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    
    //fontWeight: '600',
    textAlign: 'center',
    //color: Colors.dark,
  },

  subcontainer: {
    width: "80%",
    marginTop: 20,
    backgroundColor: "#32DBD2",
    borderRadius:10,
    borderWidth:3,
    borderColor: "#32DBD2",
    
  },
  
  engine: {
    marginTop: 3,
    //marginBottom: 10,
    //top: 92,
    left: 10,
    fontSize: 15,
    color: "#763895",
    fontWeight: "bold",
    //fontWeight: '600',
  },


});


export default App;