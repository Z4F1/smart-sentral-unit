FROM golang:1.23.3 as build

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy project
COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o deviceservice

FROM alpine:latest

WORKDIR /app

COPY --from=build /app/deviceservice ./

# Run
CMD ["./deviceservice"]
