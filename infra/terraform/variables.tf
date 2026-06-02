variable "aws_region" {
  description = "AWS region."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix used for AWS resources."
  type        = string
  default     = "eks-healthcare"
}

variable "vpc_cidr" {
  type    = string
  default = "10.40.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.40.1.0/24", "10.40.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.40.11.0/24", "10.40.12.0/24"]
}

variable "availability_zones" {
  type    = list(string)
  default = []
}

# EKS CLuster
variable "cluster_name" {
  description = "EKS cluster name."
  type        = string
  default     = "healthcare-eks"
}

variable "cluster_version" {
  description = "Kubernetes version."
  type        = string
  default     = "1.31"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS nodes."
  type        = string
  default     = "t3.medium"
}

variable "node_desired" {
  type    = number
  default = 2
}

variable "node_min" {
  type    = number
  default = 2
}

variable "node_max" {
  type    = number
  default = 4
}

# ── Database (RDS PostgreSQL) ────────────────────────
variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "healthcare"
}

variable "db_username" {
  description = "PostgreSQL admin username."
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL admin password."
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

# ── ElastiCache Redis ────────────────────────────────
variable "redis_node_type" {
  description = "ElastiCache node type."
  type        = string
  default     = "cache.t3.micro"
}

# ── ECR / Deploy ─────────────────────────────────────
variable "image_tag" {
  description = "Container image tag to deploy from ECR."
  type        = string
  default     = "v1"
}

# ── Tags 
variable "tags" {
  type = map(string)
  default = {
    Environment = "demo"
    Owner       = "classroom"
    # Project     = "HealthcareSystem"
  }
}