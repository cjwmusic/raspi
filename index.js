var gpio = require("pi-gpio")
var rpio = require("rpio")


var led_port = 21;

//set gpio map
rpio.init({mapping : 'gpio'});

rpio.open(led_port, rpio.OUTPUT, rpio.LOW);

for (var i = 0; i < 5; i++) {
	rpio.write(led_port, rpio.HIGH);
	console.log('High');
	rpio.sleep(1);	
	rpio.write(led_port, rpio.LOW);
	console.log('Low');
	rpio.msleep(500);
}
