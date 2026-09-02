# 🎬 MultimediaSaver-Web

**MultimediaSaver-Web** is a web application designed to identify and download multimedia content such as videos and images from webpages.

This project also demonstrates an **end-to-end DevSecOps implementation**, covering source-code management, continuous integration, security scanning, containerization, and GitOps-based deployment to a Kubernetes cluster.

The CI/CD workflow is built using **GitHub, Jenkins, Docker, OWASP Dependency-Check, SonarQube, Trivy, Ansible Vault, Argo CD, and Kubernetes**.

The goal of this project is to demonstrate how an application can be **securely built, validated, containerized, and deployed automatically** using modern DevSecOps practices.
![MultimediaSaver-Web Homepage](./assets/homepage.png)

## 🛠️ Technology Stack

The following tools and technologies are used to build, secure, containerize, and deploy **MultimediaSaver-Web**.

| Technology / Tool             | Purpose                                                       |
| ----------------------------- | ------------------------------------------------------------- |
| 🐙 **GitHub**                 | Source Code Management and Git repository hosting             |
| 🔵 **Jenkins**                | Continuous Integration (CI) and pipeline automation           |
| 🐳 **Docker**                 | Application containerization and image creation               |
| 🔍 **OWASP Dependency-Check** | Scans project dependencies for known security vulnerabilities |
| 📊 **SonarQube**              | Static code analysis and code quality checks                  |
| 🛡️ **Trivy**                 | Filesystem and Docker image vulnerability scanning            |
| 🔐 **Hashicorp Vault**          | Encryption and secure management of sensitive data            |
| 🟢 **Argo CD**                | Continuous Deployment (CD) using GitOps                       |
| ☸️ **Kubernetes**             | Container orchestration and application deployment            |
| 📦 **Container Registry**     | Stores and manages Docker container images                    |



How pipeline will look after deployment:
- CI pipeline to build and push
<Jenkins CI Screenshot>

- CD pipeline to update application version
<Jenkins CD Screenshot>

- ArgoCD application for deployment on K8s
<Argocd cluster Screenshot>

Discord Pipeline Update Notification
<Discord notification screenshot>


# 🏗️ Project Implementation

This project implements an end-to-end CI/CD pipeline with security and code-quality checks integrated into the build process.
The overall workflow is:

1. 👨‍💻 Developer pushes code to GitHub.
2. 🔔 GitHub Webhook triggers the Jenkins pipeline.
3. 🔵 Jenkins performs Continuous Integration (CI) by building, scanning, and validating the application.
4. 🐳 Jenkins builds the Docker image and pushes it to a container registry after successful validation.
5. 🟢 Argo CD performs Continuous Deployment (CD) using a GitOps-based approach.
6. ☸️ Argo CD synchronizes the desired state with the Kubernetes cluster.

# 🔵 Continuous Integration — Jenkins

Jenkins is responsible for automating the CI process, including application validation, security scanning, Docker image creation, and publishing the image to a container registry.

## 🔄 CI Pipeline Stages
### 1. 📥 Checkout

Jenkins pulls the latest source code from the GitHub repository.

### 2. 🔍 Dependency Scan

OWASP Dependency-Check scans project dependencies for publicly known security vulnerabilities.

### 3. 📊 Code Quality Analysis

SonarQube analyzes the source code for:

- Bugs
- Vulnerabilities
- Code smells
- Maintainability issues
- Code quality problems
### 4. 🛡️ Filesystem Security Scan

Trivy scans the project filesystem for known vulnerabilities and security issues before the Docker image is built.

### 5. 🐳 Docker Build

After the initial validation stages pass, Jenkins builds a Docker image from the application source code.
```bash
docker build -t <image-name>:<tag> .
```
### 6. 🔐 Container Image Scan

Trivy scans the generated Docker image for known vulnerabilities.
```bash
trivy image <image-name>:<tag>
```
The pipeline can be configured to fail when vulnerabilities above a defined severity level are detected.

### 7. 📦 Push Docker Image

After all required CI and security checks pass, Jenkins pushes the Docker image to the configured container registry.
```bash
docker push <registry>/<image-name>:<tag>
```
The image can then be referenced by the Kubernetes deployment.


## 🛠️ Installation & Setup

The following installation steps assume an Ubuntu Linux environment.

#### 1. Git Installation
Git is required for source-code management and for interacting with GitHub repositories.

```bash
sudo apt update
sudo apt install git -y
```

Verify:

```bash
git --version
```

#### 2. Docker Installation
Docker is used to build and package the application into a container image.

Install Docker:

Follow the instructions for linux environment: [Docker Setup](https://docs.docker.com/engine/install/ubuntu/)

Verify:

```bash
docker --version
```
Allow the current user to run Docker without sudo:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

#### 3. Jenkins Installation
Jenkins is used as the Continuous Integration server.

Install Jenkins
Add the Jenkins repository and install Jenkins according to the current Jenkins LTS installation instructions. [Jenkins Installation](https://www.jenkins.io/doc/book/installing/linux/)

After installation:
```bash
sudo systemctl enable jenkins
sudo systemctl start jenkins
```
Check status:

```bash
sudo systemctl status jenkins
```

Jenkins normally runs on:

```bash
http://<SERVER-IP>:8080
```
Retrieve the initial administrator password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
Recommended Jenkins Plugins
Install plugins such as:

- Pipeline Stage View
- Git
- GitHub Integration
- Docker Pipeline
- Credentials Binding
- SonarQube Scanner
- OWASP Dependency-Check


#### 4. SonarQube Installation

SonarQube is used for static code analysis and code quality checks.

For a development/lab environment, SonarQube can be run using Docker.

Create persistent volumes:

```bash
docker volume create sonarqube_data
docker volume create sonarqube_logs
docker volume create sonarqube_extensions
```
Run SonarQube:

```bash
docker run -d \
  --name sonarqube \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_logs:/opt/sonarqube/logs \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  sonarqube:lts-community
```

Check the container:

Access SonarQube:
```bash
http://<SERVER-IP>:9000
```
Default Username: `Admin` and Password: `Admin`.

#### 5. OWASP Dependency-Check Installation
OWASP Dependency-Check is used to identify publicly disclosed vulnerabilities in project dependencies.

There are few common approaches:

Jenkins Plugin
Install the OWASP Dependency-Check Plugin from:

Jenkins

→ Manage Jenkins
→ Plugins
→ Available Plugins
→ OWASP Dependency-Check

Configure the tool under:

Manage Jenkins
→ Tools
→ Dependency-Check


#### 6. Trivy Installation
Trivy is used for security scanning.

It can scan:

→ Filesystems
→ Docker images
→ Container configurations
→ Kubernetes-related resources

Install Trivy on Ubuntu using the official repository method. [Trivy Installation](https://trivy.dev/docs/latest/getting-started/installation/#debianubuntu-official)

After installation:

```bash
trivy --version
```
Test Scan Project Filesystem

From the project directory:
```bash
trivy fs .
```
Test Scan Docker Image

After building the image run:

```bash
trivy image multimediasaver-web:latest
```
For CI, you can configure the pipeline to fail when vulnerabilities above your chosen severity are detected:

```bash
trivy fs --severity HIGH,CRITICAL --exit-code 1 .
```

#### 7. kubectl Installation

kubectl is the Kubernetes command-line tool used to communicate with the cluster.

Install kubectl using the official Kubernetes installation instructions.[kubectl Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-on-linux)

Verify:
```bash
kubectl version --client
```
Configure/access the cluster:
```bash
kubectl get nodes
```

#### 8. Kubernetes Installation

Kubernetes is used as the container orchestration platform.

For a lab environment, Kubernetes can be created using tools such as:

- Minikube
- Kind
- kubeadm
- Managed Kubernetes services
For a production-style environment, use an appropriate Kubernetes distribution or managed Kubernetes service.

Verify Kubernetes access:
```bash
kubectl version --client
```

Check the cluster:
```bash
kubectl get nodes
```
Check running resources:
```bash
kubectl get pods -A
```

#### 9. Argo CD Installation

Argo CD is used for Continuous Deployment and GitOps.

Create the Argo CD namespace:
```bash
kubectl create namespace argocd
```
Install Argo CD:
```bash
kubectl apply -n argocd \
  --server-side \
  --force-conflicts \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
Verify:
```bash
kubectl get pods -n argocd
```

All Argo CD components should eventually reach the Running state.

The official Argo CD getting-started guide uses the argocd namespace and Kubernetes manifests for installation. For production, pin Argo CD to a specific version rather than tracking the stable manifest directly. 

Access Argo CD
For a lab environment, port-forward the Argo CD server:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
Then access:
```bash
https://<SERVER-IP>:8080
```
#### 🔗 Argo CD GitOps Configuration
Create an Argo CD Application that points to the Git repository containing the Kubernetes manifests.

Example structure:

```bash
GitHub
│
├── application-source
│   ├── Dockerfile
│   ├── application files
│   └── Jenkinsfile
│
└── kubernetes
    ├── app-deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

Argo CD continuously monitors the Kubernetes manifest repository.

In this project, **Ansible Vault can be used to protect sensitive configuration files**, while **HashiCorp Vault provides centralized storage and retrieval of secrets** used by the CI/CD environment.

### 🔐 HashiCorp Vault Installation

For this project, Vault is configured in **development mode using Docker**.

> ⚠️ **Note:** Vault development mode is intended only for development and testing. It runs with an in-memory storage backend, uses a predefined root token, and should **not** be used in production environments.

### 1. Pull the Vault Docker Image

```bash
docker pull hashicorp/vault:latest
```

### 2. Start Vault in Development Mode

Run Vault as a Docker container:

```bash
docker run --cap-add=IPC_LOCK \
  -d \
  --name vault \
  -p 8200:8200 \
  -e VAULT_DEV_ROOT_TOKEN_ID=root \
  hashicorp/vault:latest
```

### 3. Verify the Vault Container

Check that the Vault container is running:

```bash
docker ps
```

You should see the Vault container running on port `8200`.

Check the container logs:

```bash
docker logs vault
```

### 4. Access Vault UI

Vault's web UI is available at:

```text
http://<SERVER-IP>:8200
```

For local development:

```text
http://localhost:8200
```

Use the development `root` token configured when starting the container

> ⚠️ The `root` token shown above is only suitable for a local development environment. Never use a development root token in a production deployment.

### 5. Authenticate with Vault

For the development environment:

```bash
vault login root
```

Enter the development root token when prompted.

### 6. Store Secrets in Vault

Enable the KV secrets engine if required:

```bash
vault secrets enable -path=secret <desirable token>-v2
```

Store an example Docker registry credential:

```bash
vault <Chosen token> put secret/docker \
  username="<DOCKER_USERNAME>" \
  password="<DOCKER_PASSWORD>"
```

### 8. Retrieve Secrets

To read the stored secret:

```bash
vault kv get secret/<token>
```

You can also retrieve a specific field:

```bash
vault kv get -field=username secret/<token>
```

## 🔐 Using HashiCorp Vault Secrets for Kubernetes Image Pull Authentication

To securely pull private Docker images into the Kubernetes cluster, Docker registry credentials are stored in **HashiCorp Vault** instead of being hardcoded in Kubernetes manifests.

The credentials are retrieved using a **Custom Resource Definition (CRD)** and **External Secrets Operator**, which creates a Kubernetes Secret containing the Docker registry credentials in `.dockerconfigjson` format.

The generated Secret is then associated with a **Kubernetes ServiceAccount** using `imagePullSecrets`.

This allows every Pod that uses the ServiceAccount to authenticate with the private Docker registry, regardless of which Kubernetes node the Pod is scheduled on.

### 🔄 Secret Management Architecture

```text
                         HashiCorp Vault
                               |
                               | Docker Credentials
                               | username / password
                               v
                    ┌──────────────────────┐
                    │   Vault CRD /        │
                    │   SecretStore        │
                    │                      │
                    │ Connects to Vault    │
                    └──────────┬───────────┘
                               |
                               | Retrieve Secret
                               v
                    ┌──────────────────────┐
                    │ External Secrets     │
                    │ Operator             │
                    │                      │
                    │ ExternalSecret CRD   │
                    └──────────┬───────────┘
                               |
                               | Creates / Updates
                               v
                    ┌──────────────────────┐
                    │ Kubernetes Secret    │
                    │                      │
                    │ .dockerconfigjson    │
                    └──────────┬───────────┘
                               |
                               | imagePullSecrets
                               v
                    ┌──────────────────────┐
                    │ Kubernetes           │
                    │ ServiceAccount       │
                    └──────────┬───────────┘
                               |
                               | Used by Pods
                               v
              ┌─────────────────────────────────┐
              │          Kubernetes Cluster     │
              │                                 │
              │  Node 1        Node 2       Node 3
              │    |              |             |
              │   Pod            Pod           Pod
              │    |              |             |
              │    +--------------+-------------+
              │                   |
              │                   v
              │          Private Docker Registry
              └─────────────────────────────────┘
```

## 1. Store Docker Credentials in HashiCorp Vault

Docker registry credentials are first stored securely in HashiCorp Vault.

For example:

```bash
vault kv put secret/<desirable-name> \
  username="<DOCKER_USERNAME>" \
  password="<DOCKER_PASSWORD>"
```
Verify the stored secret:

```bash
vault kv get secret/docker
```

The Vault secret is structured as:

```text
secret/<desirable-name>
├── username
└── password
```

## 2. Create a Custom Resource to Access Vault

The Kubernetes cluster needs a way to communicate with HashiCorp Vault.

**External Secrets Operator** provides the required Kubernetes Custom Resource Definitions (CRDs) for connecting Kubernetes to external secret providers such as Vault.

A `SecretStore` defines the connection between Kubernetes and the Vault server.

Example:

[Follow secret-store.yaml](./kubernetes/secret-store.yaml)

Apply the manifest:

```bash
kubectl apply -f secret-store.yaml
```

Verify:

```bash
kubectl get secretstore
```

Check the status:

```bash
kubectl describe secretstore vault-secret-store
```

The `SecretStore` acts as the configuration required by External Secrets Operator to access the Vault server.


## 3. Create the ExternalSecret Resource

The `ExternalSecret` resource defines which secret should be retrieved from Vault and how it should be converted into a Kubernetes Secret.

Example:

[Follow external-secret-dockerhub-token.yaml](./kubernetes/external-secret-dockerhub-token.yaml)

Apply the manifest:

```bash
kubectl apply -f external-secret.yaml
```

Verify:

```bash
kubectl get externalsecret
```

Check the ExternalSecret:

```bash
kubectl describe externalsecret docker-registry-secret
```

After successful synchronization, External Secrets Operator creates the Kubernetes Secret:

```text
docker-registry-secret
```

with the following type:

```text
kubernetes.io/dockerconfigjson
```

## 4. Verify the Generated Docker Registry Secret

Check the Kubernetes Secret:

```bash
kubectl get secret docker-registry-secret
```

Verify the Secret type:

```bash
kubectl get secret docker-registry-secret \
  -o jsonpath='{.type}'
```

Expected output:

```text
kubernetes.io/dockerconfigjson
```

The Secret contains the Docker registry configuration under:

```text
.dockerconfigjson
```

The credentials are stored by Kubernetes in encoded form and are not exposed directly in the Deployment manifest.



## 5. Create a Kubernetes ServiceAccount

Instead of adding `imagePullSecrets` individually to every Pod, the Docker registry Secret can be associated with a Kubernetes ServiceAccount.

Create a ServiceAccount:

[Follow service-account.yaml] (./kubernetes/service-account.yaml)

Apply it:

```bash
kubectl apply -f service-account.yaml
```

Verify:

```bash
kubectl get serviceaccount multimediasaver-sa
```

Inspect the ServiceAccount:

```bash
kubectl describe service-account multimediasaver-sa
```

The ServiceAccount now references:

```text
docker-registry-secret
```

as an image pull secret.


## 6. Use the ServiceAccount in the Deployment

The application Deployment can now reference the ServiceAccount.

Example:

```yaml

    spec:
      serviceAccountName: multimediasaver-sa

```

Notice that the Deployment does **not** need to directly define:

```yaml
imagePullSecrets:
  - name: docker-registry-secret
```

because the ServiceAccount already contains the image pull secret.


## 7. How the ServiceAccount Works Across Kubernetes Nodes

The ServiceAccount is associated with the Pod, not with a specific Kubernetes node.

If a Pod using `multimediasaver-sa` is scheduled on **Node 1**, **Node 2**, or **Node 3**, Kubernetes can use the associated image pull secret when pulling the private container image.

> **Important:** The Secret is not copied to every node. Kubernetes uses the Secret when a Pod requiring it is scheduled and its image needs to be pulled.



## 🌐 Kubernetes Ingress

Kubernetes **Ingress** is used to expose the `MultimediaSaver-Web` application outside the Kubernetes cluster and make it accessible through a web browser.

Instead of exposing the application directly using a `NodePort` or `LoadBalancer`, Ingress provides an HTTP/HTTPS entry point and routes incoming traffic to the Kubernetes Service.

### 1. Install an Ingress Controller

An Ingress resource by itself does not handle traffic. An **Ingress Controller** must be running in the Kubernetes cluster.

For this project, **NGINX Ingress Controller** can be used.

For a development/lab environment, install the NGINX Ingress Controller using the official Kubernetes manifest:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

Verify the Ingress Controller:

```bash
kubectl get pods -n ingress-nginx
```

Check the service:

```bash
kubectl get svc -n ingress-nginx
```

The Ingress Controller should eventually reach the `Running` state.

> ⚠️ The installation method may vary depending on your Kubernetes environment. Cloud-managed clusters, Minikube, Kind, and bare-metal Kubernetes may require different networking or LoadBalancer configuration.

---

### 2. Create the Kubernetes Service

Before creating the Ingress resource, the application should have a Kubernetes Service that exposes the application Pods internally.
[Follow service.yaml](./kubernetes/service.yaml)


Apply the Service:

```bash
kubectl apply -f service.yaml
```

Verify:

```bash
kubectl get svc multimediasaver-web
```

Expected result:

```text
NAME                 TYPE        CLUSTER-IP      PORT(S)
multimediasaver-web  ClusterIP   10.x.x.x        80/TCP
```

The Service forwards traffic from port `80` to the application's container port `3001`.

---

### 3. Create the Ingress Resource

Create an Ingress manifest to route browser traffic to the `MultimediaSaver-Web` Service.

[Follow ingress.yaml](./kubernetes/ingress.yaml)

Apply the Ingress:

```bash
kubectl apply -f ingress.yaml
```

Verify:

```bash
kubectl get ingress
```

For more details:

```bash
kubectl describe ingress multimediasaver-web
```


### 5. Access the Application from a Browser

Once the Ingress Controller, Service, and Ingress resource are configured, open the following URL in your browser:

```text
http://<>SERVER_IP>
```

### 6. Verify the Complete Deployment

Check all Kubernetes resources:

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

You can also check the complete application resources:

```bash
kubectl get all
```

Check Ingress Controller logs if the application is not accessible:

```bash
kubectl logs -n ingress-nginx \
  -l app.kubernetes.io/component=controller
```
### 🚀 Argo CD Deployment

The Kubernetes resources are not manually deployed using `kubectl apply` in the final GitOps workflow.

The manifests are committed to the GitOps repository:
```text
GitOps Repository
│
├── deployment.yaml
├── service.yaml
├── serviceaccount.yaml
└── ingress.yaml
```
Argo CD continuously monitors the GitOps repository and deploys these resources to the Kubernetes cluster.

This follows the GitOps deployment model, where Git acts as the source of truth for the Kubernetes application's desired state.


## 🌐 Mapping a Domain Name to the Kubernetes Cluster

To make `MultimediaSaver-Web` accessible from the internet using a custom domain name, the domain must be mapped to the **public IP address of the Kubernetes Ingress Controller**.

The overall flow is:

```text
                         🌐 Internet
                             |
                             | https://multimediasaver.example.com
                             v
                       ┌─────────────┐
                       │     DNS     │
                       │             │
                       │ Domain Name │
                       └──────┬──────┘
                              |
                              | Resolves to
                              | Public IP
                              v
                    ┌────────────────────┐
                    │ Public IP /         │
                    │ Load Balancer      │
                    └─────────┬──────────┘
                              |
                              v
                    ┌────────────────────┐
                    │ NGINX Ingress      │
                    │ Controller         │
                    └─────────┬──────────┘
                              |
                              v
                    ┌────────────────────┐
                    │ Kubernetes Service │
                    └─────────┬──────────┘
                              |
                              v
                    ┌────────────────────┐
                    │ Application Pods   │
                    │                    │
                    │ MultimediaSaver-Web│
                    └────────────────────┘
```

### 1. Get the Public IP Address of the Kubernetes Ingress

The domain needs to point to the public endpoint through which the Ingress Controller receives internet traffic.

Check the Ingress Controller Service:

```bash
kubectl get svc -n ingress-nginx
```

For a cloud-based Kubernetes cluster, you may see:

```text
NAME                       TYPE           EXTERNAL-IP
ingress-nginx-controller   LoadBalancer   203.0.113.10
```

In this example:

```text
203.0.113.10
```
is the public IP address that receives external traffic.

> 💡 The exact setup depends on your Kubernetes environment. A cloud-managed Kubernetes cluster may automatically provision a Load Balancer, while a self-managed or bare-metal cluster may require an external load balancer, public IP, router/NAT configuration, or another networking solution.

---

### 2. Create a DNS Record

Go to your domain provider's DNS management console and create an `A` record.

For example:

```text
Type:   A
Name:   multimediasaver
Value:  203.0.113.10
TTL:    300
```

This creates:

```text
example.com
        |
        v
203.0.113.10
```

If you want to use the root domain:

```text
example.com
```

you would configure the appropriate `A` record for the root/apex domain according to your DNS provider.

### 3. Configure the Domain in the Kubernetes Ingress

The hostname in the Kubernetes Ingress must match the domain configured in DNS.

Example:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multimediasaver-web
  namespace: default

spec:
  ingressClassName: nginx

  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: multimediasaver-web
                port:
                  number: 80
```

Apply the manifest:

```bash
kubectl apply -f ingress.yaml
```

Verify:

```bash
kubectl get ingress
```

You should see the configured hostname:

```text
NAME                 HOSTS
multimediasaver-web  example.com
```

### 4. Verify DNS Resolution

From your local system, verify that the domain resolves to the correct public IP:

```bash
nslookup example.com
```

or:

```bash
dig example.com
```

The result should contain the public IP of the Ingress endpoint:

```text
example.com
        |
        v
203.0.113.10
```

You can also test the endpoint:

```bash
curl -I http://example.com
```

### 5. Configure HTTPS

For production access, the application should be served over **HTTPS** rather than plain HTTP.

A common Kubernetes approach is to use **cert-manager** with a certificate authority such as Let's Encrypt.

The HTTPS flow becomes:

```text
Browser
   |
   | HTTPS
   v
https://example.com
   |
   v
DNS
   |
   v
Public IP
   |
   v
NGINX Ingress Controller
   |
   | TLS Termination
   v
Kubernetes Service
   |
   v
MultimediaSaver-Web Pods
```

An example Ingress with TLS configuration:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multimediasaver-web
  namespace: default

spec:
  ingressClassName: nginx

  tls:
    - hosts:
        - multimediasaver.example.com
      secretName: multimediasaver-tls

  rules:
    - host: multimediasaver.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: multimediasaver-web
                port:
                  number: 80
```

The TLS Secret:

```text
multimediasaver-tls
```

contains the certificate and private key used by the Ingress Controller.

### 🚀 GitOps Deployment with Argo CD

As part of this project's GitOps workflow, the Ingress configuration is stored in the GitOps repository along with the other Kubernetes manifests.

```text
GitOps Repository
│
├── deployment.yaml
├── service.yaml
├── serviceaccount.yaml
└── ingress.yaml
        |
        v
     Argo CD
        |
        | Sync
        v
Kubernetes Cluster
        |
        +── Deployment
        +── Service
        +── ServiceAccount
        +── Ingress
        |
        v
NGINX Ingress Controller
        |
        v
Public Internet
        |
        v
multimediasaver.example.com
```

Argo CD continuously monitors the GitOps repository and deploys the updated Kubernetes manifests to the cluster. This keeps the Kubernetes cluster synchronized with the desired state defined in Git.

> ⚠️ **Important:** Making a Kubernetes application publicly accessible requires more than DNS configuration. The cluster must have a reachable public endpoint, the required firewall/security-group ports must be open (typically `80` and `443`), and the Ingress Controller must be correctly configured to receive external traffic.






