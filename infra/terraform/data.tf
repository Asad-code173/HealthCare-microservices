data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

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
    "gateway",
    "auth-service",
    "patient-service",
    "doctor-service",
    "appointment-service",
  ]

  service_ports = {
    frontend            = 3000
    gateway             = 8080
    auth-service        = 8001
    doctor-service      = 8002
    patient-service     = 8003
    appointment-service = 8004
  }
}