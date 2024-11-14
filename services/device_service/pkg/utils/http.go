package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func Request[T any](method string, url string) (T, error) {
	req, err := http.NewRequest(method, url, nil)

	if err != nil {
		return *new(T), fmt.Errorf("failed to create request for '%s': %v", url, err)
	}

	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		return *new(T), fmt.Errorf("failed to %s '%s': %v", method, url, err)
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return *new(T), fmt.Errorf("server error: %d", res.StatusCode)
	}

	body, err := io.ReadAll(res.Body)

	if err != nil {
		return *new(T), fmt.Errorf("failed to read body: %v", err)
	}

	var data T
	err = json.Unmarshal(body, &data)
	if err != nil {
		return *new(T), fmt.Errorf("failed to parse body: %v", err)
	}

	return data, nil
}
