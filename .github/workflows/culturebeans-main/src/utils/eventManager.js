// Event Management System
const eventManager = {
    events: {},
    
    subscribe: function (eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    },

    publish: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));
        }
    }
};

export default eventManager;
