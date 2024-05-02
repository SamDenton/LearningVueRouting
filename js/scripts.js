const Home = { template: '<div class="content">Just a little demo site for learning Vue.JS</div>' };

const ContactView = {
    template: `
      <div class="content">
        <h2>Contact Us</h2>
        <form @submit.prevent="submitForm">
          <label for="name">Name:</label>
          <input type="text" v-model="name" required>
          <span v-if="nameError">{{ nameError }}</span>
  
          <label for="email">Email:</label>
          <input type="email" v-model="email" required>
          <span v-if="emailError">{{ emailError }}</span>
  
          <button type="submit">Submit</button>
        </form>
      </div>
    `,
    data() {
      return {
        name: '',
        email: '',
        nameError: '',
        emailError: ''
      };
    },
    methods: {
      submitForm() {
        this.nameError = '';
        this.emailError = '';
  
        if (this.name.length < 2) {
          this.nameError = 'Name must be at least 2 characters.';
        }
        if (!this.email.includes('@')) {
          this.emailError = 'Please enter a valid email.';
        }
        if (!this.nameError && !this.emailError) {
          alert('Form submitted successfully!' + '\n' + 'Name: ' + this.name + '\n' + 'Email: ' + this.email);
        }
      }
    }
  };
  
  const InfoView = {
    template: `
      <div class="content">
        <h2>Information Page</h2>
        <p>This is a basic information page to demonstrate dynamic data handling in Vue.js.</p>
        <p>The current date and time is: {{ currentTime }}</p>
      </div>
    `,
    data() {
      return {
        currentTime: new Date().toLocaleString()
      };
    },
    created() {
      setInterval(() => {
        this.currentTime = new Date().toLocaleString();
      }, 1000);
    }
  };

  const ClickTracker = {
    template: `
      <div class="content">
        <h2>Click Tracker</h2>
        <p>This graph tracks clicks over time, while anywhere on the site!<p>
        <canvas id="clickChart"></canvas>
      </div>
    `,
    data() {
      return {
        chart: null
      };
    },
    methods: {
      initializeGraph() {
        const ctx = document.getElementById('clickChart').getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.$root.clicks.map(item => `${new Date(item.interval * this.$root.interval * 1000).toLocaleTimeString()}`),
            datasets: [{
              label: 'Clicks per ' + this.$root.interval + ' seconds',
              data: this.$root.clicks.map(item => item.count),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              fill: false,
              tension: 0.4  // This creates the smooth curve effect
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            elements: {
              line: {
                tension: 0.4 // Smooth curves
              }
            }
          }
        });
      },
      updateGraph() {
        this.chart.data.labels = this.$root.clicks.map(item => `${new Date(item.interval * this.$root.interval * 1000).toLocaleTimeString()}`);
        this.chart.data.datasets.forEach((dataset) => {
          dataset.data = this.$root.clicks.map(item => item.count);
        });
        this.chart.update();
      }
    },
    mounted() {
      this.initializeGraph();
      this.$root.$on('update-graph', this.updateGraph);
    },
    beforeDestroy() {
      this.$root.$off('update-graph', this.updateGraph);
    }
  }; 
  
// Define the InteractivePage component
const InteractivePage = {
  data() {
    return {
      squares: [
        {
          id: 1,
          posX: 150,
          posY: 200,
          width: 200,
          height: 100,
          color: 'red',
          content: '<button class="inner-btn">Press Me!</button>'
        },
        {
          id: 2,
          posX: 300,
          posY: 350,
          width: 100,
          height: 300,
          color: 'green',
          content: '<ul><li>Item One</li><li>Item Two</li><li>Item Three</li></ul>'
        },
        {
          id: 3,
          posX: 450,
          posY: 100,
          width: 150,
          height: 150,
          color: 'purple',
          content: '<img src="https://fastly.picsum.photos/id/418/200/300.jpg?hmac=T7cC_OCVJnIk98mcvhuKBWancCeGl2KcyuSBTCYE-QM" alt="Placeholder Image" style="width: 100%; height: 100%; object-fit: cover;">'
        }
      ],
      contentTemplates: [
        { type: 'button', html: '<button class="inner-btn">Click Me!</button>' },
        { type: 'list', html: '<ul><li>List Item 1</li><li>List Item 2</li><li>List Item 3</li></ul>' },
        { type: 'table', html: '<table class="inner-table"><tr><th>Header</th></tr><tr><td>Cell</td></tr></table>' },
        { type: 'paragraph', html: '<p>This is a sample text paragraph, explaining something important.</p>' },
        { type: 'image', html: '<img src="https://fastly.picsum.photos/id/436/200/300.jpg?hmac=OuJRsPTZRaNZhIyVFbzDkMYMyORVpV86q5M8igEfM3Y" alt="Placeholder Image" style="width: 100%; height: 100%; object-fit: cover;">' },
        { type: 'form', html: '<form><input type="text" placeholder="Enter Text"/><button>Submit</button></form>' },
        { type: 'sidebar', html: '<div class="sidebar"><h3>Topics</h3><ul><li>Science</li><li>Technology</li><li>History</li><li>Biography</li><li>Art</li></ul></div>' },
        { type: 'video', html: '<video controls style="width: 100%; height: 100%;"><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">Your browser does not support the video tag.</video>' },
        { type: 'iframe', html: '<iframe src="https://www.wikipedia.org/" frameborder="0" style="width: 100%; height: 100%;"></iframe>'}
      ]      
    };
  },
  methods: {
    handlePositionUpdate(payload) {
      const square = this.squares.find(s => s.id === payload.id);
      if (square) {
        square.posX = payload.posX;
        square.posY = payload.posY;
      }
    },
    checkForOverlap(newSquare) {
      return this.squares.some(square => {
        return !(newSquare.posX + newSquare.width < square.posX ||
                 newSquare.posX > square.posX + square.width ||
                 newSquare.posY + newSquare.height < square.posY ||
                 newSquare.posY > square.posY + square.height);
      });
    },
    addRandomSquare() {
      const newId = this.squares.length + 1; // Simple ID generation strategy
      let attempts = 0;
      let newSquare;
      do {
        newSquare = {
          id: newId,
          posX: Math.random() * (window.innerWidth - 200),
          posY: Math.random() * (window.innerHeight - 200),
          width: 200 + Math.random() * 100,
          height: 200 + Math.random() * 100,
          color: `hsl(${Math.random() * 360}, 100%, 70%)`,
          content: this.contentTemplates[Math.floor(Math.random() * this.contentTemplates.length)].html
        };
        attempts++;
        if (attempts > 50) { // Prevent infinite loops
          alert("Failed to place new square without overlapping after 50 attempts.");
          return;
        }
      } while (this.checkForOverlap(newSquare));
  
      this.squares.push(newSquare);
    },
    deleteSquare(squareId) {
      this.squares = this.squares.filter(square => square.id !== squareId);
    }  
  },  
  template: `
  <div class="interactive-container content">
    <h1>Interactive Elements</h1>
    <p>This page spawns draggable elements with random content. Try moving them around!</p>
    <button @click="addRandomSquare" id="spawnBTN">Add Random Element!</button>
    <draggable-square
      v-for="square in squares"
      :key="square.id"
      @delete-square="deleteSquare"
      :pos-x="square.posX"
      :pos-y="square.posY"
      :squares="squares"
      :id="square.id"
      :color="square.color"
      :width="square.width"
      :height="square.height"
      :content="square.content"
      @update-position="handlePositionUpdate"
    ></draggable-square>
  </div>
`
};

// Set up the router
const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', redirect: '/click-tracker' },
        { path: '/home', component: Home },
        { path: '/contact', component: ContactView },
        { path: '/info', component: InfoView },
        { path: '/click-tracker', component: ClickTracker },
        { path: '/interactive', component: InteractivePage }
      ]
  });
  
  // Vue instance
new Vue({
    el: '#app',
    router,
    template: `
      <div>
        <h1>My SPA with Vue Router</h1>
        <nav>
          <router-link class="router-link" to="/home">Home</router-link>
          <router-link class="router-link" to="/contact">Contact Us</router-link>
          <router-link class="router-link" to="/info">Info</router-link>
          <router-link class="router-link" to="/click-tracker">Click Tracker</router-link>
          <router-link class="router-link" to="/interactive">Playground</router-link>

        </nav>
        <router-view></router-view>
      </div>
    `,
    data: {
        clicks: [],
        lastInterval: null,
        interval: 10,  // Interval in seconds, adjustable
        maxEntries: 12  // Maximum number of entries
      },
      methods: {
        registerGlobalClick() {
          const currentInterval = Math.floor(Date.now() / (this.interval * 1000));
    
          if (this.lastInterval !== currentInterval) {
            this.addInterval(currentInterval);
          } else if (!this.clicks.length || this.clicks[this.clicks.length - 1].interval !== currentInterval) {
            this.clicks.push({ interval: currentInterval, count: 1 });
          } else {
            this.clicks[this.clicks.length - 1].count++;
          }
          this.$emit('update-graph');
        },
        initializeClicks() {
            const now = Date.now();
            const currentInterval = Math.floor(now / (this.interval * 1000));
            this.lastInterval = currentInterval - this.maxEntries;
            for (let i = 0; i < this.maxEntries; i++) {
              this.clicks.push({ interval: this.lastInterval + i, count: 0 });
            }
        },
        addInterval(currentInterval) {
          if (this.lastInterval !== null) {
            // Add all missing intervals with 0 clicks
            for (let i = this.lastInterval + 1; i <= currentInterval; i++) {
              this.clicks.push({ interval: i, count: 0 });
              if (this.clicks.length > this.maxEntries) {
                this.clicks.shift();
              }
            }
          }
          this.lastInterval = currentInterval;
        },
        updateClicksPeriodically() {
          const intervalUpdate = () => {
            const currentInterval = Math.floor(Date.now() / (this.interval * 1000));
            if (this.lastInterval !== currentInterval) {
              this.addInterval(currentInterval);
              this.$emit('update-graph');
            }
          };
          setInterval(intervalUpdate, this.interval * 1000);
        }
      },
      created() {
        this.initializeClicks();
        document.addEventListener('click', this.registerGlobalClick);
        this.updateClicksPeriodically();
      },
      beforeDestroy() {
        document.removeEventListener('click', this.registerGlobalClick);
      }
    });


Vue.component('draggable-square', {
  props: {
    color: String,
    posX: Number,
    posY: Number,
    squares: Array,
    id: Number,
    width: Number,
    height: Number,
    content: String
  },
  template: `
    <div :style="styleObject" @mousedown="startDrag" @mouseup="stopDrag" @mousemove="onDrag" @mouseleave="stopDrag">
      <div v-html="content" class="randObject"></div> <!-- Render the HTML content -->
    </div>
  `,
  data() {
    return {
      isDragging: false,
      localPosX: this.posX,
      localPosY: this.posY,
      velocity: { x: 0, y: 0 },
      gravity: 0.2,
      friction: 0.99,
      // lastInteracted: Date.now(),
      styleObject: {
        width: `${this.width}px`,
        height: `${this.height}px`,
        backgroundColor: this.color,
        position: 'absolute',
        left: `${this.posX}px`,
        top: `${this.posY}px`,
        userSelect: 'none',
        cursor: 'pointer'
      }
    };
  },
  watch: {
    posX(newVal) {
      this.localPosX = newVal;
      this.updatePosition();
    },
    posY(newVal) {
      this.localPosY = newVal;
      this.updatePosition();
    }
  },
  methods: {
    startDrag(event) {
      this.isDragging = true;
      this.currentMouseX = event.clientX;
      this.currentMouseY = event.clientY;
    },
    onDrag(event) {
      if (this.isDragging) {
        const dx = event.clientX - this.currentMouseX;
        const dy = event.clientY - this.currentMouseY;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.currentMouseX = event.clientX;
        this.currentMouseY = event.clientY;
        this.localPosX += dx;
        this.localPosY += dy;
        this.$emit('update-position', { id: this.id, posX: this.localPosX, posY: this.localPosY });
      }
    },
    stopDrag() {
      this.isDragging = false;
      // this.lastInteracted = Date.now();
      this.applyPhysics();
      // this.scheduleRestCheck();
      // this.logSquaresData();
      this.applyPhysics();
    },
    updatePosition() {
      this.styleObject.left = `${this.localPosX}px`;
      this.styleObject.top = `${this.localPosY}px`;
    },
    applyPhysics() {
      if (!this.isDragging) {
        const animationLoop = () => {
          if (!this.isDragging) {
            // Apply gravity and friction
            this.velocity.x *= this.friction;
            this.velocity.y = this.velocity.y * this.friction + this.gravity;
    
            // Predict next position
            let nextPosX = this.localPosX + this.velocity.x;
            let nextPosY = this.localPosY + this.velocity.y;
    
            // Boundary collision checks (walls)
            if (nextPosX <= 0 || nextPosX + parseInt(this.styleObject.width) >= window.innerWidth) {
              this.velocity.x = -this.velocity.x * 0.9; // Reverse and dampen the velocity
              nextPosX = nextPosX <= 0 ? 0 : window.innerWidth - parseInt(this.styleObject.width);
            }
            if (nextPosY <= 0 || nextPosY + parseInt(this.styleObject.height) >= window.innerHeight) {
              this.velocity.y = -this.velocity.y * 0.9; // Reverse and dampen the velocity
              nextPosY = nextPosY <= 0 ? 0 : window.innerHeight - parseInt(this.styleObject.height);
            }

            // Collision with other squares
            this.squares.forEach(other => {
              if (other.id !== this.id && this.checkCollision(other)) {
                const overlapX = (this.localPosX + this.width / 2) - (other.posX + other.width / 2);
                const overlapY = (this.localPosY + this.height / 2) - (other.posY + other.height / 2);
    
                if (Math.abs(overlapX) > Math.abs(overlapY)) { // More horizontal collision
                  this.velocity.x = -this.velocity.x * 0.9; // Reverse x velocity
                  nextPosX = overlapX > 0 ? other.posX + other.width : other.posX - this.width;
                } else { // More vertical collision
                  this.velocity.y = -this.velocity.y * 0.9; // Reverse y velocity
                  nextPosY = overlapY > 0 ? other.posY + other.height : other.posY - this.height;
                }
              }
            });
    
            // Update local position to next position
            this.localPosX = nextPosX;
            this.localPosY = nextPosY;

            this.$emit('update-position', { id: this.id, posX: this.localPosX, posY: this.localPosY });
    
            // Update the visual position
            this.updatePosition();
    
            // Continue animation if significant velocity exists
            if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
              this.settlingFrames = 0; // Reset the counter if still moving
              requestAnimationFrame(animationLoop);
            } else if (this.settlingFrames < 10) { // Allow some frames to settle
              this.settlingFrames++;
              requestAnimationFrame(animationLoop);
            }
          }
        };
        requestAnimationFrame(animationLoop);
        
      }
    },
    checkCollision(other) {
      const rect1 = {
        x: this.localPosX,
        y: this.localPosY,
        width: this.width - 0,
        height: this.height - 0
      };
      const rect2 = {
        x: other.posX,
        y: other.posY,
        width: other.width,
        height: other.height
      };
    
      // Check if the current square overlaps with the 'other' square
      return (rect1.x < rect2.x + rect2.width &&
              rect1.x + rect1.width > rect2.x &&
              rect1.y < rect2.y + rect2.height &&
              rect1.y + rect1.height > rect2.y);
    },
    // scheduleRestCheck() {  // Function not in use but keeping it to show deletion syntax
    //   clearTimeout(this.restCheckTimeout);
    //   this.restCheckTimeout = setTimeout(() => {
    //     if (this.isResting && (Date.now() - this.lastInteracted > 300)) { // 3 seconds of rest
    //       alert('Square ' + this.id + ' has been resting for 3 seconds. Deleting...');
    //       this.$emit('delete-square', this.id);
    //     } else if (!this.isResting) {
    //       this.scheduleRestCheck(); // Reschedule if still not resting
    //     }
    //   }, 1000); // Check every second
    // },
    logSquaresData() {
      console.log('Current squares data:', this.squares.map(sq => ({
        id: sq.id,
        posX: sq.posX,
        posY: sq.posY,
        width: sq.width,
        height: sq.height,
        color: sq.color
      })));
      console.log('Current square data:', {
        id: this.id,
        posX: this.localPosX,
        posY: this.localPosY,
        width: this.width,
        height: this.height,
        color: this.color
      })
    }
  },
  mounted() {
    this.applyPhysics();  // Start the physics simulation when the component mounts
  },
  destroyed() {
    clearTimeout(this.restCheckTimeout);
  }
});
    