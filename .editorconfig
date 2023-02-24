{
  "tasks": [
    {
      "name": "aws-cli",
      "env": {
        "AWS_CLI_AUTO_PROMPT": "on-partial"
      },
      "init": "cd /workspace\ncurl \"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\" -o \"awscliv2.zip\"\nunzip awscliv2.zip\nsudo ./aws/install\ncd $THEIA_WORKSPACE_ROOT\n"
    },
    {
      "name": "postgres",
      "init": "curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc|sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg\necho \"deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main\" |sudo tee  /etc/apt/sources.list.d/pgdg.list\nsudo apt update\nsudo apt install -y postgresql-client-13 libpq-dev\n"
    },
    {
      "name": "npm installation",
      "init": "cd /workspace/aws-bootcamp-cruddur-2023/frontend-react-js\nnpm i\nexit\n"
    }
  ],
  "vscode": {
    "extensions": [
      "42Crunch.vscode-openapi",
      "cweijan.vscode-postgresql-client2"
    ]
  }
}