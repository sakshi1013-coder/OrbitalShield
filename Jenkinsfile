pipeline {
    agent any

    stages {

        stage('Clean Environment') {
            steps {
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
                sh 'docker compose ps'
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