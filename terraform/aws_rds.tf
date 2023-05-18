provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

resource "aws_db_instance" "example" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  name                 = "dbname"
  username             = "admin"
  password             = "yourpassword"
  parameter_group_name = "default.mysql5.7"
  publicly_accessible  = true
  skip_final_snapshot  = true
#   vpc_security_group_ids = ["random-sg"] 
  db_subnet_group_name = "default"
}

variable "access_key" {}
variable "secret_key" {}
variable "region" {
  default = "us-west-2"
}