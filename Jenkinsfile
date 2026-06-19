pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Environment') {
            steps {
                sh 'docker rm -f orbitalshield-db orbitalshield-backend orbitalshield-frontend || true'
                sh 'docker compose down --remove-orphans || true'
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: OrbitalShield built and deployed successfully!'
        }
        failure {
            echo 'FAILURE: Pipeline execution failed.'
        }
    }
}
