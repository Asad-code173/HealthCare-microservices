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