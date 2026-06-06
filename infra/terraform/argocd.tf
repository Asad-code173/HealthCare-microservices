# ── ArgoCD Namespace ──────────────────────────────────
resource "kubernetes_namespace" "argocd" {
  metadata {
    name = "argocd"
  }

  depends_on = [aws_eks_node_group.main]
}

# ── ArgoCD Helm Install ───────────────────────────────
resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.argocd.metadata[0].name
  version    = "6.7.3"

  set {
    name  = "server.insecure"
    value = "true"
  }

  set {
    name  = "server.service.type"
    value = "ClusterIP"
  }

  depends_on = [
    aws_eks_node_group.main,
    kubernetes_namespace.argocd,
    helm_release.lb_controller,  # ← added
  ]
}

# ── ArgoCD App of Apps ────────────────────────────────
resource "helm_release" "argocd_app_of_apps" {
  name       = "app-of-apps"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argocd-apps"
  namespace  = "argocd"
  version    = "1.6.2"

  values = [
    yamlencode({
      applications = [{
        name      = "app-of-apps"
        namespace = "argocd"
        project   = "default"
        source = {
          repoURL        = "https://github.com/Asad-code173/HealthCare-microservices"
          targetRevision = "HEAD"
          path           = "argocd/apps"
        }
        destination = {
          server    = "https://kubernetes.default.svc"
          namespace = "argocd"
        }
        syncPolicy = {
          automated = {
            prune    = true
            selfHeal = true
          }
        }
      }]
    })
  ]

  depends_on = [helm_release.argocd]
}