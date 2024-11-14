package models

type Device struct {
	DeviceID string `json:"deviceId"`
	Active   bool   `json:"active"`
}

func NewDevice(id string) Device {
	return Device{DeviceID: id, Active: true}
}
