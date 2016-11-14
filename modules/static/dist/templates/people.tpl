{{#if data.extra.rich_data.full_name}}
  {{#with data.extra}}
    <div class='cqz-result-h3'>
      {{#if image.src}}
          <div class="cqz-image cqz-image-round" style="
                      position:relative;
                      background-image: url({{ image.src }});
                      width: 54px;">
          </div>
      {{/if}}
      <div class='cqz-result-center cqz-vert-center'
           {{#if image.src}}
              style="width: calc(85% - 60px); position:relative;"
           {{/if}}>
          <div class='cqz-result-title overflow' extra="title">
            <a href="{{../url}}" extra="title">{{ rich_data.full_name }}</a>
          </div>
          <div class='cqz-result-url overflow
                      {{#if urlDetails.ssl }}
                           cqz-result-url-ssl
                      {{/if}}

          ' extra="url">
              {{ emphasis ../urlDetails.friendly_url text 2 true }}
          </div>
          {{#with rich_data}}
              <div class='cqz-result-desc overflow'>
              {{#if current_job_type }}
                  {{ current_job_type }},
              {{/if}}
                  {{ current_company }}
              </div>
          {{/with}}
      </div>
      {{> logo}}
    </div>
  {{/with}}
{{else}}
  {{partial 'generic'}}
{{/if}}