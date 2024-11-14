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

	return &DeviceController{natsClient: natsClient}, nil
}

func (dc DeviceController) initDevices() error {
	devices, err := utils.Request[[]models.Device]("GET", "http://"+os.Getenv("DISCOVERY_IP")+":8080/devices")

	if err != nil {
		return err
	}

	dc.devices = devices

	fmt.Printf("Loading device data %s\n", dc.devices[0].DeviceID)

	return nil
}

func (dc DeviceController) initEndpoints() error {

	dc.natsClient.Subscribe("device.connect", func(d models.Device) {
		fmt.Printf("%s", d.DeviceID)
	})

	dc.natsClient.Subscribe("device.update", func(d models.Device) {
		fmt.Printf("%s", d.DeviceID)
	})

	dc.natsClient.Subscribe("device.disconnect", func(d models.Device) {
		fmt.Printf("%s", d.DeviceID)
	})

	return nil
}

func (dc DeviceController) Start() error {
	err := dc.initDevices()

	if err != nil {
		return fmt.Errorf("failed to retrieve device data: %v", err)
	}

	err = dc.initEndpoints()

	if err != nil {
		return fmt.Errorf("failed to initiate nats endpoints: %v", err)
	}

	return dc.waitForShutdown()
}

func (dc *DeviceController) waitForShutdown() error {
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	fmt.Println("Subscribed and waiting.")
	<-sigs // Block until a termination signal is received

	fmt.Println("Service shutdown.")
	err := dc.natsClient.Drain()
	if err != nil {
		return fmt.Errorf("failed to drain client: %v", err)
	}

	return nil
}
