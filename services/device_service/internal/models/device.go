package models

type Device struct {
	DeviceID string `json:"deviceId"`
	IP       string `json:"ip"`
	Active   bool   `json:"active"`
}

func NewDevice(id string) Device {
	return Device{DeviceID: id, Active: true}
}
