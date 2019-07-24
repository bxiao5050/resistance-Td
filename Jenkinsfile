node () {
    def workspace = pwd()
    
    stage ('install') {
        try {
            sh 'npm install'
        } catch(err) {
            sh 'echo "npm install error"'
            throw err
            sh 'exit 1'
        }
    }
    stage ('build') {
        try {
            sh 'npm run build'
        } catch(err) {
            sh 'echo "npm run build error"'
            throw err
            sh 'exit 1'
        }
    }
}