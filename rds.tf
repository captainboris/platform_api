locals {

  postgres_identifier    = beequantapi_1
  postgres_name          = beequantapi_1
  postgres_user_name     = postgres
  postgres_user_password = CORE_ADMIN
  postgres_instance_name = beequantapi_1
  postgres_db_password   = CORE_ADMIN
  postgres_port          = 5432

}

// PROVIDERS
provider "aws" {
  region                  = "ap-southeast-2"
  shared_credentials_file = "$HOME/.aws/credentials"
}

provider "postgresql" {
  host            = aws_db_instance.postgres.address
  port            = local.postgres_port
  database        = local.postgres_database_name
  username        = local.postgres_username
  password        = local.postgres_password
  sslmode         = "require"
  connect_timeout = 15
  superuser       = false
}

// POSTGRES
resource "aws_security_group" "security_group_name" {
  name = "security_group_name"

  ingress {
    from_port   = local.postgres_port
    to_port     = local.postgres_port
    protocol    = "tcp"
    description = "PostgreSQL"
    cidr_blocks = ["0.0.0.0/0"] // >
  }

  ingress {
    from_port        = local.postgres_port
    to_port          = local.postgres_port
    protocol         = "tcp"
    description      = "PostgreSQL"
    ipv6_cidr_blocks = ["::/0"] // >
  }
}

resource "aws_db_instance" "instance_name" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "12.2"
  instance_class         = "db.t2.micro"
  identifier             = local.postgres_identifier
  name                   = local.postgres_instance_name
  username               = local.postgres_user_name
  password               = local.postgres_db_password
  publicly_accessible    = true
  parameter_group_name   = "default.postgres12"
  vpc_security_group_ids = [aws_security_group.<security_group_name>.id]
  skip_final_snapshot    = true
}

resource "postgresql_role" "user_name" {
  name                = local.postgres_user_name
  login               = true
  password            = local.postgres_user_password
  encrypted_password  = true
  create_database     = true
  create_role         = true
  skip_reassign_owned = true
}