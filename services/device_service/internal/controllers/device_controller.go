package controllers

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"floatinggoat.no/service/deviceservice/internal/models"
	"floatinggoat.no/service/deviceservice/pkg/natsclient"
	"floatinggoat.no/service/deviceservice/pkg/utils"
)

type DeviceController struct {
	natsClient *natsclient.NATSClient[models.Device]
	devices    []models.Device
}

func NewDeviceController() (*DeviceController, error) {
	natsClient, err := natsclient.NewNATSClient[models.Device]()

	if err != nil {
		return nil, err
	}

	devices, err := utils.Request[[]models.Device]("GET", "http://"+os.Getenv("DISCOVERY_IP")+"/devices")

	if err != nil {
		return nil, err
	}

	return &DeviceController{natsClient: natsClient, devices: devices}, nil
}

func (dc DeviceController) init() {
	fmt.Printf("Loading device data %s\n", dc.devices[0].DeviceID)
}

func (dc DeviceController) Start() error {
	dc.init()

	dc.natsClient.Subscribe("device.connect", func(d models.Device) {
		fmt.Printf("%s", d.DeviceID)
	})

	dc.natsClient.Subscribe("device.update", func(d models.Device) {
		fmt.Printf("%s", d.DeviceID)
	})

	dc.natsClient.Subscribe("device.disconnect", func(d models.Device) {
		fmt.Printf("%s", d.DeviceID)
	})

	dc.waitForShutdown()

	err := dc.natsClient.Drain()
	if err != nil {
		return fmt.Errorf("failed draining nats: %v", err)
	}

	return nil
}

func (dc *DeviceController) waitForShutdown() {
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	fmt.Println("Subscribed and waiting.")
	<-sigs // Block until a termination signal is received
	fmt.Println("Shutting down.")
}
