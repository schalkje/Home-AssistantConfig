class HeatControler extends HTMLElement {
  constructor () {
    super();

    this._hass = null
    this._cardElement = null
    this._debugElement = null
  }
    // constructor() {
  //   super();
  //   // Make use of shadowRoot to avoid conflicts when reusing
  //   this.attachShadow({ mode: 'open' });
    
  // }

  
    RenderTemperatureBox(name,value,style)
    {
      const tempBox = document.createElement('div');
      tempBox.id = name;
      tempBox.className = 'tempbox'
      tempBox.style = style;
      const tempValue = document.createElement('span');
      const tempSymbol = document.createElement('span');
      tempValue.innerHTML = value;
      tempValue.className = 'tempvalue';
      tempSymbol.innerHTML = '&deg;C';
      tempSymbol.className = 'tempsymbol';
      tempBox.appendChild(tempValue);
      tempBox.appendChild(tempSymbol);
      return tempBox;
    }

    RenderZone(zone, boxHeight)
    {
      var top = 0;
      var left = 0;
      var zone = document.createElement('div');
      // left = 50*zone;
      zone.appendChild(this.RenderTemperatureBox('input-z' + zone,'24.1','top: '+top+'px;left: '+left+'px;'));
      top -= boxHeight;
      left = 100;
      zone.appendChild(this.RenderTemperatureBox('temp-z' + zone,'19.1','top: '+top+'px;left: '+left+'px;'));
      top -= boxHeight;
      left = 200;
      zone.appendChild(this.RenderTemperatureBox('output-z' + zone,'20.1','top: '+top+'px;left: '+left+'px;'));

      return zone;
    }

    RenderCircuit(circuit, boxHeight)
    {
      var top = 0;
      var left = 0;
      var circuitElement = document.createElement('div');
      // left = 50*zone;
      circuitElement.appendChild(this.RenderTemperatureBox('input-c' + circuit,'24.1','top: '+top+'px;left: '+left+'px;'));
      top -= boxHeight;
      left = 100;
      circuitElement.appendChild(this.RenderTemperatureBox('temp-c' + circuit,'19.1','top: '+top+'px;left: '+left+'px;'));
      top -= boxHeight;
      left = 200;
      circuitElement.appendChild(this.RenderTemperatureBox('output-c' + circuit,'20.1','top: '+top+'px;left: '+left+'px;'));

      return circuitElement;
    }

    RenderDebug(hass)
    {
      // find debug element
      if ( !this._debugElement )
      {
        this._debugElement = document.createElement('div');
        //  debugElement.id = 'debug';
        this._debugElement.className = 'debug';
        this._cardElement.appendChild(this._debugElement);
      }


      const inputID = this.config.input;
      const outputID = this.config.output;
      const title_string = this.config.title;
      const show_empty = this.config.show_empty;

      var d = new Date();
      var n = d.toTimeString();
      this._debugElement.innerHTML = "<span>"+ n + "</span><br\>";

      if (title_string) {
        this._debugElement.innerHTML = this._debugElement.innerHTML + "<h1>" + title_string + "</h1>";
      } else {
        this._debugElement.innerHTML = this._debugElement.innerHTML + "No title <br/>";
      }


      this._debugElement.innerHTML = this._debugElement.innerHTML + "<h2>Controller</h2>";
      
      if (inputID)
      {
        const input_state = hass.states[inputID].state;
        // retrieve state
        this._debugElement.innerHTML = this._debugElement.innerHTML + "input temperature=" + input_state + "<br/>";
      }
      if (outputID)
      {
        const output_state = hass.states[outputID].state;
        // retrieve state
        this._debugElement.innerHTML = this._debugElement.innerHTML + "output temperature=" + output_state + "<br/>";
        }



        const zonesList = this.config.zones;
      if (zonesList)
      {
        this._debugElement.innerHTML = this._debugElement.innerHTML + "<h2>zones</h2>";
        zonesList.forEach(zone => {
          if ( zone.zone)
          {
            this._debugElement.innerHTML = this._debugElement.innerHTML + "<h3>zone: " + zone.zone + "</h3>";
          } else {
            this._debugElement.innerHTML = this._debugElement.innerHTML + "<h3>unnamed zone</h3>";
          }

          const rooms = zone.rooms;
          if (rooms)
          {
            rooms.forEach(room => {
              this._debugElement.innerHTML = this._debugElement.innerHTML + "<h4>room: " + room.room + "</h4>";
              if (room.temperature)
              {
                this._debugElement.innerHTML = this._debugElement.innerHTML + "room temperature=<b>" + hass.states[room.temperature].state + "</b> (" +  room.temperature + ")<br/>";
              }
              if (room.humidity)
              {
                this._debugElement.innerHTML = this._debugElement.innerHTML + "room humidity=<b>" + hass.states[room.humidity].state + "</b> (" +  room.humidity + ")<br/>";
              }
                
            })
          } else {
            this._debugElement.innerHTML = this._debugElement.innerHTML + "no rooms<br/>";
          }

          const circuits = zone.circuits;
          if (circuits)
          {
            circuits.forEach(circuit => {
              if ( circuit.circuit)
              {
                this._debugElement.innerHTML = this._debugElement.innerHTML + "<h4>circuit: " + circuit.circuit + "</h4>";

                if (circuit.input)
                {
                  this._debugElement.innerHTML = this._debugElement.innerHTML + "input temperature=<b>" + hass.states[circuit.input].state + "</b> (" +  circuit.input + ")<br/>";
                }

                if (circuit.output)
                {
                  this._debugElement.innerHTML = this._debugElement.innerHTML + "output temperature=<b>" + hass.states[circuit.output].state + "</b> (" +  circuit.output + ")<br/>";
                }
                
                const rooms = circuit.rooms;
                if (rooms)
                {
                  rooms.forEach(room => {
                    this._debugElement.innerHTML = this._debugElement.innerHTML + "<h5>room: " + room.room + "</h5>";
                    if (room.temperature)
                    {
                      this._debugElement.innerHTML = this._debugElement.innerHTML + "room temperature=<b>" + hass.states[room.temperature].state + "</b> (" +  room.temperature + ")<br/>";
                    }
                    if (room.humidity)
                    {
                      this._debugElement.innerHTML = this._debugElement.innerHTML + "room humidity=<b>" + hass.states[room.humidity].state + "</b> (" +  room.humidity + ")<br/>";
                    }
                      
                  })
                } else {
                  this._debugElement.innerHTML = this._debugElement.innerHTML + "no rooms<br/>";
                }

              } else {
                this._debugElement.innerHTML = this._debugElement.innerHTML + "<h4>unnamed circuit</h4>";
              }              
            });
          } else {
            this._debugElement.innerHTML = this._debugElement.innerHTML + "no circuits<br/>";
          }
        });
      } else
      {
        this._debugElement.innerHTML = this._debugElement.innerHTML + "<h2>no zones</h2>";
      }
      
      return true;
    }

    set hass(hass) {
      // get configuration
      this.RenderDebug(hass);
    }
    setConfig(config) {
      if (!config || !config.zones || !Array.isArray(config.zones)) {
        throw new Error('Zone config incorrect');
      }

      if (this.lastChild) this.removeChild(this.lastChild);

      
      this.style.boxShadow = "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.15)";
      this.style.borderRadius = "2px";
      this.style.background = "var(--paper-card-background-color)";

      const card = document.createElement('heat-controler');

      const content = document.createElement('div');
      content.id = "value"

      // create a title box
      if (config.title) {
        const title = document.createElement('div');
        title.id = "title"
        title.textContent = config.title;
        title.className = "header";
        title.style = "font-family: var(--paper-font-headline_-_font-family); -webkit-font-smoothing: var(--paper-font-headline_-_-webkit-font-smoothing); font-size: var(--paper-font-headline_-_font-size); font-weight: var(--paper-font-headline_-_font-weight); letter-spacing: var(--paper-font-headline_-_letter-spacing); line-height: var(--paper-font-headline_-_line-height);text-rendering: var(--paper-font-common-expensive-kerning_-_text-rendering);opacity: var(--dark-primary-opacity);padding: 24px 16px 0px 16px";
        card.appendChild(title);
      }


      const style = document.createElement('style');
      style.textContent = `
        #title {
          font-size: calc(var(--base-unit) * 0.5);
          line-height: calc(var(--base-unit) * 0.5);
          color: var(--primary-text-color);
        }

        div.tempbox {
          font-size: calc(var(--base-unit) * 0.5);
          line-height: calc(var(--base-unit) * 0.5);
          color: var(--primary-text-color);
          padding: 2px 2px 2px 4px;
          border: solid 1px grey;
          background: yellow;

          position: relative;
          top: 0px;
          left: 0;
          width: 50px;
          height: 20px;
        }
        .tempsymbol {
          margin-left:4px;
        }
        .tempvalue {
          font-size: calc(var(--base-unit) * 0.7);
          font-weight: bold;
        }
      `;


      var boxHeight = 26;
      var top = 0;
      var left = 0;
      left = 0;
      content.appendChild(this.RenderTemperatureBox('input','22.5','top: '+top+'px;left: '+left+'px;'));

      top -= boxHeight;
      left = 120;
      content.appendChild(this.RenderTemperatureBox('output','20.2','top: '+top+'px;left: '+left+'px;'));


      var zone=0;
      var circuit=0;
      content.appendChild(this.RenderCircuit(++circuit, boxHeight));
      content.appendChild(this.RenderCircuit(++circuit, boxHeight));









      card.appendChild(content);
      card.appendChild(style);

      // // initialize zones reference      
      // this._refZones = [];
      this.appendChild(card);
      this._cardElement = card;

      // if (!config.entity) {
      //   throw new Error('You need to define an entity');
      // }
      if (!config.show_empty) {
        config.show_empty = false;
      }
      this.config = config;


    }

  
    getCardSize() {
      return 1;
    }
  }
  // register the class as a custom element
  customElements.define('heat-controler', HeatControler);