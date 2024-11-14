package natsclient

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/nats-io/nats.go"
)

type NATSClient[T any] struct {
	conn *nats.Conn
}

func NewNATSClient[T any]() (*NATSClient[T], error) {
	natsIP := os.Getenv("NATS_IP")
	username := os.Getenv("NATS_USERNAME")
	password := os.Getenv("NATS_PASSWORD")

	conn, err := nats.Connect(natsIP, nats.UserInfo(username, password))

	if err != nil {
		return nil, fmt.Errorf("failed to connect to NATS: %v", err)
	}

	fmt.Printf("Connected to NATS: %s \n", natsIP)
	return &NATSClient[T]{conn: conn}, nil
}

func (nc *NATSClient[T]) Subscribe(subj string, cb func(T)) error {
	_, err := nc.conn.Subscribe(subj, func(msg *nats.Msg) {
		var data T
		json.Unmarshal(msg.Data, &data)

		cb(data)
	})

	if err != nil {
		return fmt.Errorf("failed to subscribe: %v", err)
	}

	return nil
}

func (nc *NATSClient[T]) Publish(subj string, data T) error {
	msg, _ := json.Marshal(data)
	err := nc.conn.Publish(subj, msg)

	if err != nil {
		return fmt.Errorf("failed to publish: %v", err)
	}

	return nil
}

func (nc *NATSClient[T]) Request(subj string) (T, error) {

	return *new(T), nil
}

func (nc *NATSClient[T]) Drain() error {
	return nc.conn.Drain()
}
