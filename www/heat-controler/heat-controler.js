class HeatControler extends HTMLElement {
  // constructor() {
  //   super();
  //   // Make use of shadowRoot to avoid conflicts when reusing
  //   this.attachShadow({ mode: 'open' });
    
  // }

    set hass(hass) {
      // get configuration
      const inputID = this.config.input;
      const outputID = this.config.output;
      const title_string = this.config.title;
      const show_empty = this.config.show_empty;

      if (title_string) {
        this.innerHTML = "<h1>" + title_string + "</h1>";
      } else {
        this.innerHTML = "No title <br/>";
      }


      this.innerHTML = this.innerHTML + "<h2>Controller</h2>";
      
      if (inputID)
      {
        const input_state = hass.states[inputID].state;
        // retrieve state
        this.innerHTML = this.innerHTML + "input temperature=" + input_state + "<br/>";
      }
      if (outputID)
      {
        const output_state = hass.states[outputID].state;
        // retrieve state
        this.innerHTML = this.innerHTML + "output temperature=" + output_state + "<br/>";
        }

      const zonesList = this.config.zones;
      if (zonesList)
      {
        this.innerHTML = this.innerHTML + "<h2>zones</h2>";
        zonesList.forEach(zone => {
          if ( zone.zone)
          {
            this.innerHTML = this.innerHTML + "<h3>zone: " + zone.zone + "</h3>";
          } else {
            this.innerHTML = this.innerHTML + "<h3>unnamed zone</h3>";
          }

          const rooms = zone.rooms;
          if (rooms)
          {
            rooms.forEach(room => {
              this.innerHTML = this.innerHTML + "<h4>room: " + room.room + "</h4>";
              if (room.temperature)
              {
                this.innerHTML = this.innerHTML + "room temperature=<b>" + hass.states[room.temperature].state + "</b> (" +  room.temperature + ")<br/>";
              }
              if (room.humidity)
              {
                this.innerHTML = this.innerHTML + "room humidity=<b>" + hass.states[room.humidity].state + "</b> (" +  room.humidity + ")<br/>";
              }
                
            })
          } else {
            this.innerHTML = this.innerHTML + "no rooms<br/>";
          }

          const circuits = zone.circuits;
          if (circuits)
          {
            circuits.forEach(circuit => {
              if ( circuit.circuit)
              {
                this.innerHTML = this.innerHTML + "<h4>circuit: " + circuit.circuit + "</h4>";

                if (circuit.input)
                {
                  this.innerHTML = this.innerHTML + "input temperature=<b>" + hass.states[circuit.input].state + "</b> (" +  circuit.input + ")<br/>";
                }

                if (circuit.output)
                {
                  this.innerHTML = this.innerHTML + "output temperature=<b>" + hass.states[circuit.output].state + "</b> (" +  circuit.output + ")<br/>";
                }
                
                const rooms = circuit.rooms;
                if (rooms)
                {
                  rooms.forEach(room => {
                    this.innerHTML = this.innerHTML + "<h5>room: " + room.room + "</h5>";
                    if (room.temperature)
                    {
                      this.innerHTML = this.innerHTML + "room temperature=<b>" + hass.states[room.temperature].state + "</b> (" +  room.temperature + ")<br/>";
                    }
                    if (room.humidity)
                    {
                      this.innerHTML = this.innerHTML + "room humidity=<b>" + hass.states[room.humidity].state + "</b> (" +  room.humidity + ")<br/>";
                    }
                      
                  })
                } else {
                  this.innerHTML = this.innerHTML + "no rooms<br/>";
                }

              } else {
                this.innerHTML = this.innerHTML + "<h4>unnamed circuit</h4>";
              }              
            });
          } else {
            this.innerHTML = this.innerHTML + "no circuits<br/>";
          }
        });
      } else
      {
        this.innerHTML = this.innerHTML + "<h2>no zones</h2>";
      }

      // if (zones.count == 0) {
      //   this.innerHTML = this.innerHTML + "<h2>zones</h2>";
      // } else {
      //   this.innerHTML = "No zones <br/>";
      // }

//       if (state.length != 0) {
//         if (title_string) {
//           this.innerHTML = title_string;
//           // this.innerHTML = "input=" + input_state + "<br>";
//           // this.innerHTML = "output=" + output_state + "<br>";
//         } else {
//           this.innerHTML = "no title";
// //          this.innerHTML = input_state;
//         }
//       } else if (show_empty == true) {
//         if (title_string) {
//           this.innerHTML = title_string;
//         } else {
//           this.innerHTML = "No state, no title";
//         }
//       }
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
      `;
      card.appendChild(content);
      card.appendChild(style);

      // // initialize zones reference      
      // this._refZones = [];



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