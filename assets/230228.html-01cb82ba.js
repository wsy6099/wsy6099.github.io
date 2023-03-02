import{_ as n,p as s,q as a,Y as t}from"./framework-e1bed10d.js";const p={},o=t(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p><strong>依赖</strong></p><div class="language-language-cobol line-numbers-mode" data-ext="language-cobol"><pre class="language-language-cobol"><code>yarn add fs
yarn add scp2
yarn add chalk
yarn add ssh2
yarn add cross-env
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>创建文件 deploy.js</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;fs&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 服务器配置信息</span>
<span class="token keyword">const</span> server <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&quot;xxx.xxx.xxx.xxx&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 服务器ip</span>
  <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token string">&quot;22&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 端口一般默认22</span>
  <span class="token literal-property property">username</span><span class="token operator">:</span> <span class="token string">&quot;root&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 用户名</span>
  <span class="token literal-property property">serverPath</span><span class="token operator">:</span> <span class="token string">&quot;/data/xxxxxx&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 服务器路径（结尾加/）</span>
  <span class="token literal-property property">packageName</span><span class="token operator">:</span> <span class="token string">&quot;xxx&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 上传到服务器的位置</span>
  <span class="token literal-property property">localPath</span><span class="token operator">:</span> <span class="token string">&quot;./dist/&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 本地打包文件路径</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// 引入scp2</span>
<span class="token keyword">const</span> client <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;scp2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ora <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;ora&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> spinner <span class="token operator">=</span> <span class="token function">ora</span><span class="token punctuation">(</span><span class="token string">&quot;正在发布到服务器...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//ssk 使用密钥访问</span>
<span class="token keyword">const</span> key <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">readFileSync</span><span class="token punctuation">(</span><span class="token string">&quot;./ssh.pem&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 创建shell脚本</span>
<span class="token keyword">const</span> Client <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;ssh2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Client<span class="token punctuation">;</span>
<span class="token keyword">const</span> conn <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;正在建立连接&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
conn
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;ready&quot;</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;已连接&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>server<span class="token punctuation">.</span>packageName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;连接已关闭&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      conn<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// console.log(&#39;测试成功&#39;);</span>
    <span class="token comment">// conn.end()</span>
    <span class="token comment">// return</span>
    <span class="token comment">// 这里我拼接了放置服务器资源目录的位置 ，首选通过rm -rf删除了这个目录下的文件</span>
    conn<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>
      <span class="token string">&quot;rm -rf &quot;</span> <span class="token operator">+</span> server<span class="token punctuation">.</span>serverPath <span class="token operator">+</span> server<span class="token punctuation">.</span>packageName <span class="token operator">+</span> <span class="token string">&quot;/*&quot;</span><span class="token punctuation">,</span>
      <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> stream</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;删除文件&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        stream
          <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;close&quot;</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">code<span class="token punctuation">,</span> signal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;开始上传&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            spinner<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            client<span class="token punctuation">.</span><span class="token function">scp</span><span class="token punctuation">(</span>
              server<span class="token punctuation">.</span>localPath<span class="token punctuation">,</span>
              <span class="token punctuation">{</span>
                <span class="token literal-property property">host</span><span class="token operator">:</span> server<span class="token punctuation">.</span>host<span class="token punctuation">,</span>
                <span class="token literal-property property">port</span><span class="token operator">:</span> server<span class="token punctuation">.</span>port<span class="token punctuation">,</span>
                <span class="token literal-property property">username</span><span class="token operator">:</span> server<span class="token punctuation">.</span>username<span class="token punctuation">,</span>
                <span class="token literal-property property">privateKey</span><span class="token operator">:</span> key<span class="token punctuation">,</span>
                <span class="token literal-property property">path</span><span class="token operator">:</span> server<span class="token punctuation">.</span>serverPath <span class="token operator">+</span> server<span class="token punctuation">.</span>packageName<span class="token punctuation">,</span>
              <span class="token punctuation">}</span><span class="token punctuation">,</span>
              <span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
                spinner<span class="token punctuation">.</span><span class="token function">stop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;项目发布完毕&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;err&quot;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                conn<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 结束命令</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span>
          <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;data&quot;</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;STDOUT: &quot;</span> <span class="token operator">+</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span>
          <span class="token punctuation">.</span>stderr<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;data&quot;</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;STDERR: &quot;</span> <span class="token operator">+</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">connect</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">host</span><span class="token operator">:</span> server<span class="token punctuation">.</span>host<span class="token punctuation">,</span>
    <span class="token literal-property property">port</span><span class="token operator">:</span> server<span class="token punctuation">.</span>port<span class="token punctuation">,</span>
    <span class="token literal-property property">username</span><span class="token operator">:</span> server<span class="token punctuation">.</span>username<span class="token punctuation">,</span>
    <span class="token comment">// password: server.password  //密码登陆</span>
    <span class="token literal-property property">privateKey</span><span class="token operator">:</span> key<span class="token punctuation">,</span> <span class="token comment">// 使用密钥登录</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>package.json 创建命令</strong></p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>...
<span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  ...
    <span class="token property">&quot;upload&quot;</span><span class="token operator">:</span> <span class="token string">&quot;node ./deploy.js&quot;</span><span class="token punctuation">,</span> 
    <span class="token property">&quot;build:test-upload&quot;</span><span class="token operator">:</span> <span class="token string">&quot;yarn build:test &amp;&amp; yarn upload&quot;</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),e=[o];function c(l,u){return s(),a("div",null,e)}const r=n(p,[["render",c],["__file","230228.html.vue"]]);export{r as default};
