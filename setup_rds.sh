#!/bin/bash

export TF_VAR_access_key=
export TF_VAR_secret_key=
export TF_VAR_region=us-west-1
# Other required env variables

terraform init
terraform apply -auto-approve
