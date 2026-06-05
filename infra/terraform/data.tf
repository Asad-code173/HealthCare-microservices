data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# EKS auth token — kubernetes + helm provider ke liye
data "aws_eks_cluster_auth" "main" {
  name = aws_eks_cluster.main.name
}

locals {
  azs = length(var.availability_zones) > 0 ? var.availability_zones : slice(data.aws_availability_zones.available.names, 0, 2)

  common_tags = merge(
    {
      Project   = var.project_name
      ManagedBy = "terraform"
    },
    var.tags
  )

  service_names = [
    "frontend",
    "auth-service",
    "patient-service",
    "doctor-service",
    "appointment-service",
  ]

  service_ports = {
    frontend            = 3000
    auth-service        = 8001
    doctor-service      = 8002
    patient-service     = 8003
    appointment-service = 8004
  }
}