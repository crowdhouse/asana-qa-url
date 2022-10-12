# Automatically link a QA url to a given asana task

## Usage

##### Step-by-Step

Add your QA URL to your PR description as 
```
Some description

QA URL: https://someurl.org

```

Attach the action to your project as in:

```
  qa_url:
    runs-on: ubuntu-latest
    steps:
      - name: Link QA url to Asana
        uses: crowdhouse/asana-qa-url@v1.1
        with:
          asana-secret: ${{ secrets.ASANA_SECRET }}
```
