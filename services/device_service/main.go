package main

import (
	"fmt"

	"floatinggoat.no/service/deviceservice/internal/controllers"
)

/*
Device Service:

Map Devices
Inneholder params {name: value}
NATS Client with "endpoints" for requests
	device.connect
		deviceid
		ip
	device.update
		deviceid
		data
	device.disconnect
		deviceid
Sends http request to device
	post {ip}/update
	update mongodb on success
MongoDB Client
	devices
*/

func main() {
	deviceController, err := controllers.NewDeviceController()
	errorHandler(err)

	err = deviceController.Start()
	errorHandler(err)

	select {}
}

func errorHandler(err error) {
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}
}
