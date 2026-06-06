# ── General ──────────────────────────────────────────
variable "aws_region" {
  description = "AWS region."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix used for all AWS resources."
  type        = string
  default     = "eks-healthcare"
}

# ── Network ──────────────────────────────────────────
variable "vpc_cidr" {
  description = "VPC CIDR block."
  type        = string
  default     = "10.40.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs — one per AZ."
  type        = list(string)
  default     = ["10.40.1.0/24", "10.40.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs — one per AZ."
  type        = list(string)
  default     = ["10.40.11.0/24", "10.40.12.0/24"]
}

variable "availability_zones" {
  description = "AZs to use. Leave empty to auto-select 2."
  type        = list(string)
  default     = []
}

# ── EKS ──────────────────────────────────────────────
variable "cluster_name" {
  description = "EKS cluster name."
  type        = string
  default     = "healthcare-eks"
}

variable "cluster_version" {
  description = "Kubernetes version."
  type        = string
  default     = "1.32"  # 1.30 support end — updated ✅
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS worker nodes."
  type        = string
  default     = "t3.medium"
}

variable "node_desired" {
  description = "Desired number of worker nodes."
  type        = number
  default     = 2
}

variable "node_min" {
  description = "Minimum number of worker nodes."
  type        = number
  default     = 2
}

variable "node_max" {
  description = "Maximum number of worker nodes — HPA ke liye."
  type        = number
  default     = 4
}

# ── RDS PostgreSQL ────────────────────────────────────
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
  description = "PostgreSQL admin password — GitHub secret se aayega."
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

# ── ElastiCache Redis ─────────────────────────────────
variable "redis_node_type" {
  description = "ElastiCache node type."
  type        = string
  default     = "cache.t3.micro"
}
variable "grafana_password" {
  description = "Grafana admin password."
  type        = string
  sensitive   = true

}

# ── Tags ──────────────────────────────────────────────
variable "tags" {
  description = "Extra tags to merge with common_tags."
  type        = map(string)
  default = {
    Environment = "demo"
    Owner       = "classroom"
  }
}