docker build . --target notifications --tag notifications:latest
docker build . --target bank-accounts --tag bank-accounts:latest
docker build . --target users --tag users:latest
docker build . --target transfers --tag transfers:latest
docker build . --target frontoffice --tag frontoffice:latest
