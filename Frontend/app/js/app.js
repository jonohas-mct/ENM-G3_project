import * as SocketIO from './lib/socket.io.min.js';
import Socket from './SOCKET/index.js';
import API from './API/index.js';
import Timer from './timer.js';
import Graphs from './graphs.js';
import Animation from './animation/index.js';
import Randomizer from './random.js';


export default class App {
    _hostname = "enmg3backend.westeurope.azurecontainer.io:5000";

    _io = io(this._hostname);
    _socket = new Socket(this);
    _api = new API(this);
    _timer = new Timer(this);
    _graph = new Graphs(this);
    _animation = new Animation(this);

    _random = new Randomizer();

    constructor() {
        Object.assign(this, ApexCharts);

        this.init();
    }

    get socketio() {
        return this._io;
    }

    get socket() {
        return this._socket;
    }

    get api() {
        return this._api;
    }

    get charts() {
      return this._graph;
    }

    get animation() {
        return this._animation;
    }

    get hostname() {
        return this._hostname;
    }

    get timer() {
        return this._timer;
    }

    get random() {
        return this._random;
    }

    set random(value) {
        this._random = value;
    }

    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        

        

        await this.waitForLoad();
        this.removeLoader();
        

        this.randomFacts();
    }

    async waitForLoad() {
        try {
            await this.api.facts.init();
            await this.timer.init();
            // now process r2
            return true;     // this will be the resolved value of the returned promise
        } catch(e) {
            console.log(e);
            throw e;      // let caller know the promise was rejected with this reason
        }
    }

    removeLoader() {
        document.querySelector('.spinning-loader').classList.add('spinning-loader--hidden');
    }

    randomFacts () {
        let r = this.random.getRandomNumberWithLast(this.api.facts.weetjes.length);
        document.querySelector("#weetje1").innerHTML = this.api.facts.weetjes[r].fact;

        let r2 = this.random.getRandomNumberWithLast(this.api.facts.weetjes.length);
        document.querySelector("#weetje2").innerHTML = this.api.facts.weetjes[r2].fact;
    }

    randomQuestion() {
        let r = this.random.getRandomNumber(this.api.facts.meerkeuze.length);
        return this.api.facts.meerkeuze[r];
    }



    domReady(e) {
        this.body = document.body;
    }
    
}