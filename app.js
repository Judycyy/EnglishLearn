const WORDS = [
  ["RAG", "rag, retrieval augmented generation", "RAG 主链路", "检索增强生成", "先从知识库检索相关资料，再把资料交给大模型生成答案的架构。", "项目核心能力是多场景 RAG 问答。"],
  ["Retrieval", "retrieval", "RAG 主链路", "检索；召回", "从 FAQ 或文档集合中找出与用户问题最相关的候选内容。", "retrieval 阶段会考虑 source、kb_version 和权限。"],
  ["Augmented", "augmented", "RAG 主链路", "增强的", "表示模型回答被外部知识库资料增强，而不是只靠模型记忆。", "Retrieval Augmented Generation 中的 augmented 指引入检索证据。"],
  ["Generation", "generation", "RAG 主链路", "生成", "大模型基于上下文组织自然语言答案的过程。", "LLM streaming 会逐 token 生成答案。"],
  ["Pipeline", "pipeline", "RAG 主链路", "流水线；处理链路", "把请求按固定阶段依次处理的流程。", "qa_core.pipeline.rag 是主编排入口。"],
  ["Orchestration", "orchestration", "RAG 主链路", "编排", "组织多个步骤、服务和判断分支，让它们按清晰顺序协作。", "QAService 作为门面，pipeline 负责 orchestration。"],
  ["Stage", "stage", "RAG 主链路", "阶段", "流水线里的一个处理节点。", "Trace 会记录每个 stage 的耗时。"],
  ["Context", "context", "RAG 主链路", "上下文", "回答问题时需要携带的状态、历史、检索结果或资料片段。", "RAGQueryContext 是请求级状态载体。"],
  ["RAGQueryContext", "rag query context", "RAG 主链路", "RAG 查询上下文对象", "项目中的请求状态对象，记录场景、会话、版本、来源和追踪信息。", "请求级状态不要存到 QAService 单例里。"],
  ["QAService", "Q A service", "RAG 主链路", "问答服务门面", "应用层对外暴露的稳定服务类。", "API 通过 get_qa_service() 获取 QAService。"],
  ["Direct Answer", "direct answer", "RAG 主链路", "直接回答", "不经过完整文档检索和 LLM 生成，直接返回确定性答案。", "问候、越界和 FAQ 精确命中可走 direct answer。"],
  ["FAQ", "F A Q", "RAG 主链路", "常见问题", "Frequently Asked Questions，标准问题和标准答案集合。", "高置信 FAQ 可以直接返回。"],
  ["FAQ Direct", "F A Q direct", "RAG 主链路", "FAQ 直出", "FAQ 命中分数足够高时直接采用标准答案。", "faq_direct_accuracy 用来评估 FAQ 直出是否准确。"],
  ["Document QA", "document Q A", "RAG 主链路", "文档问答", "从文档片段中检索证据，再生成带依据的答案。", "复杂问题通常进入 document QA。"],
  ["Insufficient Context", "insufficient context", "RAG 主链路", "上下文不足", "检索到的资料不足以支撑可靠回答时的保护性状态。", "低置信上下文不能直接交给 LLM 硬答。"],
  ["Citation", "citation", "RAG 主链路", "引用；来源标注", "答案中标明依据来自哪条文档或哪份资料。", "enforce_answer_citations 会补强来源编号。"],
  ["Source", "source", "RAG 主链路", "资料来源；业务分类", "当前项目中常指场景内的业务资料分类。", "source_filter 用来限定检索范围。"],
  ["Source Filter", "source filter", "RAG 主链路", "来源过滤", "只检索指定业务分类资料的过滤条件。", "用户选错 source_filter 时会触发 source boundary。"],
  ["Source Boundary", "source boundary", "RAG 主链路", "分类边界", "检测用户选择的分类是否和问题内容明显不匹配。", "用于避免错误资料污染答案。"],
  ["Scenario", "scenario", "场景与业务", "业务场景", "一组独立的业务知识、FAQ、文档、source 白名单和提示词变量。", "项目冻结了 8 个 scenario。"],
  ["Scenario ID", "scenario I D", "场景与业务", "场景标识", "用于唯一识别业务场景的英文 key。", "enterprise_knowledge 是一个 scenario_id。"],
  ["Enterprise Knowledge", "enterprise knowledge", "场景与业务", "企业知识库", "覆盖 HR、IT、财务制度等内部资料的场景。", "enterprise_knowledge 适合演示企业内部制度问答。"],
  ["SaaS Support", "sass support", "场景与业务", "SaaS 客服支持", "覆盖账号、计费、开放集成等 SaaS 客服知识的场景。", "saas_support 可以回答密码、退款、webhook 等问题。"],
  ["Equipment Ops", "equipment operations", "场景与业务", "设备运维", "覆盖巡检、告警、安全规范等制造业运维资料的场景。", "equipment_ops 用于设备告警和安全操作问答。"],
  ["Compliance QA", "compliance Q A", "场景与业务", "合规问答", "覆盖合同、审计、隐私保护等合规制度的场景。", "compliance_qa 适合演示高风险问题边界。"],
  ["Cross Border Risk", "cross border risk", "场景与业务", "跨境贸易风险", "覆盖海关、制裁、信用证、物流、单证等跨境贸易风险资料。", "cross_border_risk 可用于 HS 编码和制裁筛查问答。"],
  ["Tender Contract Risk", "tender contract risk", "场景与业务", "招投标合同风险", "覆盖招投标、合同、交付、验收、履约风险资料的场景。", "tender_contract_risk 适合合同履约风险演示。"],
  ["Insurance Claims", "insurance claims", "场景与业务", "保险理赔", "覆盖保单、理赔材料、责任、除外、赔付等资料的场景。", "insurance_claims 用于材料审核和赔付口径控制。"],
  ["Engineering Project QA", "engineering project Q A", "场景与业务", "工程项目问答", "覆盖图纸、规范、进度、质量、安全资料的工程场景。", "engineering_project_qa 适合多文档、多版本资料检索。"],
  ["HR", "H R", "场景与业务", "人力资源", "Human Resources，企业人员制度、入职、转正等相关领域。", "hr_data 保存企业人事制度样例。"],
  ["IT", "I T", "场景与业务", "信息技术", "Information Technology，企业信息系统、账号、网络和安全支持领域。", "it_data 里有 VPN 和访问权限资料。"],
  ["Finance", "finance", "场景与业务", "财务", "预算、报销、付款、额度等资金流程相关领域。", "finance_data 用于预算预审批和报销材料问答。"],
  ["Billing", "billing", "场景与业务", "计费；账单", "SaaS 客服场景中和发票、退款、额度相关的业务分类。", "billing_data 包含 invoice 和 refund 资料。"],
  ["Integration", "integration", "场景与业务", "集成；对接", "系统之间通过 API、Webhook 等方式连接协作。", "integration_data 用于 API 限流和 webhook 排障。"],
  ["Webhook", "web hook", "场景与业务", "回调通知", "一个系统在事件发生后主动请求另一个系统的 URL。", "webhook_retry_policy 描述回调失败后的重试规则。"],
  ["Rate Limit", "rate limit", "场景与业务", "速率限制", "限制单位时间内 API 请求数量，避免服务被打满。", "api_rate_limit 是 SaaS support 场景资料。"],
  ["Invoice", "invoice", "场景与业务", "发票", "交易、报销、付款或理赔中常见的票据资料。", "invoice_amount_mismatch 表示发票金额不一致。"],
  ["Tender", "tender", "场景与业务", "投标；招标", "招投标业务中提交或发布项目竞争文件的流程。", "tender_contract_risk 关注投标和合同风险。"],
  ["Bidding", "bidding", "场景与业务", "投标", "供应商或承包方参与项目竞争报价和提交材料的过程。", "bidding_data 包含 bid bond 和授权检查资料。"],
  ["Contract", "contract", "场景与业务", "合同", "约定权利义务、付款、交付、验收等事项的法律文件。", "contract_data 是多个场景里的核心资料分类。"],
  ["Acceptance", "acceptance", "场景与业务", "验收", "确认交付物是否满足约定要求的业务环节。", "verbal_acceptance_risk 表示口头验收风险。"],
  ["Delivery", "delivery", "场景与业务", "交付", "按合同或项目计划提交产品、服务或工程成果。", "delivery_plan 保存交付计划资料。"],
  ["Milestone", "milestone", "场景与业务", "里程碑", "项目进度中的关键节点。", "milestone_delay_matrix 用于工程进度延误分析。"],
  ["Claim", "claim", "场景与业务", "理赔；索赔", "保险或合同中提出赔付、补偿或权益请求。", "claim material 表示理赔材料。"],
  ["Liability", "liability", "场景与业务", "责任", "事故、损失或合同违约中需要承担的义务。", "liability_review 用于保险责任认定。"],
  ["Coverage", "coverage", "场景与业务", "保障范围；覆盖率", "保险中指保单保障范围，评测中也可指覆盖程度。", "keyword coverage 是评测指标。"],
  ["Exclusion", "exclusion", "场景与业务", "除外责任", "保险条款中明确不赔或不覆盖的情况。", "exclusion_rules 保存除外责任规则。"],
  ["Policy", "policy", "场景与业务", "政策；保单；策略", "可指企业制度、保险保单，也可指系统策略。", "Tool Policy 表示工具调用策略。"],
  ["Customs", "customs", "场景与业务", "海关", "跨境贸易中负责进出口监管、申报和查验的机构或流程。", "customs_data 包含 HS 归类资料。"],
  ["Sanction", "sanction", "场景与业务", "制裁", "国际贸易、合规和风控中的限制或禁令。", "sanction screening 是制裁筛查。"],
  ["HS Code", "H S code", "场景与业务", "海关商品编码", "Harmonized System Code，用于国际贸易商品归类。", "HS classification dispute 表示 HS 归类争议。"],
  ["Incoterms", "inco terms", "场景与业务", "国际贸易术语", "定义货物交付、风险转移和费用承担边界的贸易术语。", "ddp_clearance_boundary 属于物流和 Incoterms 边界问题。"],
  ["Letter of Credit", "letter of credit", "场景与业务", "信用证", "银行按单据条件承诺付款的国际贸易结算工具。", "lc_soft_clause 表示信用证软条款风险。"],
  ["Audit", "audit", "场景与业务", "审计", "对流程、记录或合规事项进行检查和评估。", "audit_issue_register 是审计问题台账。"],
  ["Privacy", "privacy", "场景与业务", "隐私", "个人数据和敏感信息保护相关领域。", "privacy_data 用于数据导出审批问答。"],
  ["Vendor", "vendor", "场景与业务", "供应商", "提供产品、服务或外包处理的外部组织。", "vendor_data_processing 涉及供应商数据处理。"],
  ["Due Diligence", "due diligence", "场景与业务", "尽职调查", "在交易、供应商或合规决策前进行背景核查和风险评估。", "supplier_due_diligence_matrix 是供应商尽调表。"],
  ["Remediation", "remediation", "场景与业务", "整改；补救", "发现问题后制定并执行修复措施。", "remediation_tracking 用于审计整改跟踪。"],
  ["Specification", "specification", "场景与业务", "规范；技术规格", "工程或产品中定义标准、参数和约束的文件。", "specification_data 包含工程规范冲突资料。"],
  ["Drawing", "drawing", "场景与业务", "图纸", "工程设计、施工或变更中使用的图形化技术文件。", "drawing_version 用于图纸版本问答。"],
  ["Safety", "safety", "场景与业务", "安全", "施工、设备或数据处理中的安全要求和风险控制。", "safety_briefing_record 是安全交底记录。"],
  ["Inspection", "inspection", "场景与业务", "检查；检验", "对设备、工程质量或材料进行核查。", "daily_inspection_register 是日常检查台账。"],
  ["Milvus", "milvus", "检索与向量库", "Milvus 向量数据库", "用于存储向量、执行相似度搜索和混合检索的数据库。", "项目使用 Milvus 2.5.x 内置 BM25。"],
  ["Vector", "vector", "检索与向量库", "向量", "把文本表示成一组数字，方便计算语义相似度。", "dense vector 用于语义检索。"],
  ["Embedding", "embedding", "检索与向量库", "嵌入；向量化", "把文本转换成向量表示的模型或过程。", "项目使用本地 BGE-M3 embedding。"],
  ["BGE-M3", "B G E M three", "检索与向量库", "BGE-M3 嵌入模型", "本项目使用的本地多语言向量模型。", "BGE-M3 为查询和文档生成 dense 向量。"],
  ["Dense", "dense", "检索与向量库", "稠密的", "向量检索中的语义向量表示，通常每个维度都有数值。", "dense search 擅长语义相近内容召回。"],
  ["Sparse", "sparse", "检索与向量库", "稀疏的", "关键词检索中的稀疏表示，只在少量词维度上有值。", "Milvus BM25 生成 sparse 表示。"],
  ["BM25", "B M twenty five", "检索与向量库", "BM25 排序算法", "经典关键词检索算法，适合精确词匹配和关键词召回。", "项目使用 Milvus BM25BuiltInFunction。"],
  ["Hybrid Search", "hybrid search", "检索与向量库", "混合检索", "把 dense 语义检索和 sparse 关键词检索结合起来。", "Milvus Hybrid Search 同时考虑语义和关键词。"],
  ["VectorStore", "vector store", "检索与向量库", "向量存储抽象", "LangChain 中封装向量数据库读写和检索的接口。", "langchain-milvus 提供 Milvus VectorStore。"],
  ["Collection", "collection", "检索与向量库", "集合", "Milvus 中存放一类向量数据的容器，类似数据库表。", "FAQ 和文档使用不同 collection。"],
  ["Index", "index", "检索与向量库", "索引", "加速检索的数据结构。", "HNSW index 是向量检索常见索引。"],
  ["HNSW", "H N S W", "检索与向量库", "分层小世界图索引", "Hierarchical Navigable Small World，常用于近似最近邻向量检索。", "docs appendix 中介绍 HNSW index。"],
  ["Similarity", "similarity", "检索与向量库", "相似度", "衡量查询和文档向量或文本之间接近程度的分数。", "检索结果按相似度和重排分数排序。"],
  ["Top K", "top K", "检索与向量库", "前 K 条", "检索时返回分数最高的 K 个候选结果。", "doc_top_k 控制文档召回数量。"],
  ["Rerank", "rerank", "检索与向量库", "重排；精排", "对初步召回结果再次排序，提高最相关资料排在前面的概率。", "BGE reranker 对 Milvus Top K 结果精排。"],
  ["Reranker", "reranker", "检索与向量库", "重排模型", "输入问题和候选文档，输出更精细相关性分数的模型。", "本地 BGE reranker 用于文档候选精排。"],
  ["CrossEncoder", "cross encoder", "检索与向量库", "交叉编码器", "把 query 和 document 一起编码，用交叉注意力判断相关性。", "CrossEncoder 比单纯向量相似度更能区分答非所问。"],
  ["Chunk", "chunk", "检索与向量库", "文本块", "文档被切分后用于入库和检索的小片段。", "低质量 chunk 会影响 RAG 回答质量。"],
  ["Chunking", "chunking", "检索与向量库", "切分", "把长文档拆成适合向量化和检索的文本块。", "docs appendix-g 介绍 chunking strategy。"],
  ["Parent Child Chunk", "parent child chunk", "检索与向量库", "父子块切分", "小块用于检索，大块用于提供更完整上下文的切分策略。", "项目文档 RAG 使用 parent-child chunk 思路。"],
  ["Splitter", "splitter", "检索与向量库", "切分器", "把文档文本拆成 chunk 的组件。", "LangChain splitter 负责文本切分。"],
  ["Loader", "loader", "检索与向量库", "加载器", "把 Markdown、PDF、CSV、XLSX、DOCX、PPTX 等资料读取成文档对象。", "document_loaders.py 封装资料加载。"],
  ["Document", "document", "检索与向量库", "文档", "LangChain 中常用的文本内容加 metadata 的数据对象。", "表格行也会转换为行级 Document。"],
  ["Metadata", "metadata", "检索与向量库", "元数据", "描述文档来源、版本、权限、行号、文件名等附加信息。", "tenant、dataset、visibility 都写入 metadata。"],
  ["Boolean Expr", "boolean expression", "检索与向量库", "布尔表达式", "由 and、or、等号等组成的真假判断条件。", "source == \"hr\" and kb_version == \"v1\" 是 boolean expr。"],
  ["Recall", "recall", "检索与评测", "召回率；召回", "检索是否找到了应该被找到的正确资料。", "Recall@K 是核心评测指标。"],
  ["Recall@K", "recall at K", "检索与评测", "前 K 召回率", "正确资料是否出现在前 K 个检索结果中。", "项目用 Recall@K 检查 RAG 回归。"],
  ["MRR", "M R R", "检索与评测", "平均倒数排名", "Mean Reciprocal Rank，正确结果越靠前，分数越高。", "mrr = 1.0 表示正确结果通常排在第一位。"],
  ["Precision", "precision", "检索与评测", "精确率", "返回结果中真正相关内容的比例。", "重排通常改善 precision。"],
  ["Accuracy", "accuracy", "检索与评测", "准确率", "预测或判断正确的比例。", "source_inference_accuracy 检查 source 推断准确率。"],
  ["Keyword Coverage", "keyword coverage", "检索与评测", "关键词覆盖率", "答案或检索结果覆盖预期关键事实词的程度。", "avg_keyword_coverage 是验收报告指标。"],
  ["Regression", "regression", "检索与评测", "回归测试", "修改后反复运行固定用例，确认旧能力没有退化。", "eval_sets 中保存多种 regression 数据集。"],
  ["Evaluation", "evaluation", "检索与评测", "评测", "用指标和样本衡量系统答案、检索和路由是否达标。", "evaluate_core_chain.py 执行核心链路评测。"],
  ["Eval Set", "evaluation set", "检索与评测", "评测集", "用于自动评测的一组问题、期望来源和期望关键词。", "business_depth_regression.json 是业务深度评测集。"],
  ["Quality Gate", "quality gate", "检索与评测", "质量门禁", "用阈值判断当前构建或评测结果是否允许通过。", "check_evaluation_gate.py 会检查召回、准确率等阈值。"],
  ["Smoke Test", "smoke test", "检索与评测", "冒烟测试", "快速检查系统关键功能是否基本可用。", "acceptance_smoke.py 会检查页面和 WebSocket。"],
  ["Baseline", "baseline", "检索与评测", "基线", "用于对比后续变化的固定参考结果。", "phase1_performance_baseline.json 是性能基线。"],
  ["Negative Sample", "negative sample", "检索与评测", "负样本", "刻意设计的不应通过或不应回答的问题样本。", "negative_boundary_regression 检查边界拦截。"],
  ["Bad Case", "bad case", "检索与评测", "问题样本；坏案例", "线上或测试中发现的错误、低质量或边界异常案例。", "LangSmith Trace + Annotation 用于 bad case 闭环。"],
  ["Annotation", "annotation", "检索与评测", "标注", "人工或系统给样本添加期望结果、标签或解释。", "expected_hit_type 和 expected_source 可作为 annotation。"],
  ["Dataset", "dataset", "检索与评测", "数据集", "一组结构化样本，可用于训练、评测或回归。", "LangSmith Dataset 可沉淀线上 bad case。"],
  ["Hit Type", "hit type", "检索与评测", "命中类型", "问题最终走到的回答路径，如 faq_direct、rag、source_boundary。", "hit_type_accuracy 衡量路径判断是否正确。"],
  ["Threshold", "threshold", "检索与评测", "阈值", "用于判断是否通过、是否直出或是否拦截的边界值。", "FAQ 直出需要 top_score 超过阈值。"],
  ["Observability", "observability", "观测与运维", "可观测性", "通过日志、指标、追踪等手段理解系统运行状态的能力。", "docs/19-observability-tracing.md 讲可观测闭环。"],
  ["Trace", "trace", "观测与运维", "链路追踪", "记录一次请求经过哪些阶段、耗时多少、产生哪些中间结果。", "LangSmith Trace 用于定位 RAG bad case。"],
  ["LangSmith", "lang smith", "观测与运维", "LangSmith 观测评测平台", "LangChain 生态中的追踪、标注、数据集和评测平台。", "项目把企业观测和 bad case 闭环交给 LangSmith。"],
  ["Logging", "logging", "观测与运维", "日志记录", "记录程序运行事件、错误和诊断信息。", "logging_config.py 统一日志配置。"],
  ["Metric", "metric", "观测与运维", "指标", "用于衡量性能、质量或稳定性的数值。", "recall_at_k、mrr、latency 都是 metric。"],
  ["Latency", "latency", "观测与运维", "延迟", "从请求发出到响应返回或阶段完成所花费的时间。", "首 token latency 会影响流式体验。"],
  ["Token", "token", "观测与运维", "词元", "大模型处理文本的基本单位，可能是字、词或子词。", "LLM streaming 会逐 token 返回。"],
  ["First Token", "first token", "观测与运维", "首个词元", "流式回答中模型返回的第一个 token。", "mark_first_token 用于记录首 token 时间。"],
  ["Streaming", "streaming", "观测与运维", "流式输出", "答案生成一部分就立即返回给前端，而不是等全部完成。", "WebSocket 返回 start、status、token、end 事件。"],
  ["Event", "event", "观测与运维", "事件", "系统在某个时刻产生的结构化消息。", "build_status_event 用于构造状态事件。"],
  ["Status", "status", "观测与运维", "状态", "当前任务、服务或请求的运行情况。", "/admin 页面展示 LangSmith、KB 版本和质量报告状态。"],
  ["Diagnostics", "diagnostics", "观测与运维", "诊断信息", "帮助定位问题的结构化中间状态和解释。", "retrieval_info 保存检索诊断字段。"],
  ["Warmup", "warm up", "观测与运维", "预热", "服务启动时提前加载模型或连接，减少首次请求延迟。", "warmup_retrieval_stack 预热检索栈。"],
  ["Preflight", "pre flight", "观测与运维", "启动前检查", "服务启动前检查依赖、配置和资源是否可用。", "validate_runtime_environment 执行 runtime preflight。"],
  ["Runtime", "runtime", "观测与运维", "运行时", "程序实际运行期间的环境、状态和依赖。", "qa_core.pipeline.runtime 定义请求运行时上下文。"],
  ["Health Check", "health check", "观测与运维", "健康检查", "用于确认服务是否存活和基本可用的接口。", "/health 返回 status 和 active scenario。"],
  ["FastAPI", "fast A P I", "后端与 API", "FastAPI 框架", "Python Web API 框架，用于定义 HTTP 和 WebSocket 服务。", "app.py 创建 FastAPI 应用。"],
  ["API", "A P I", "后端与 API", "应用程序接口", "Application Programming Interface，程序之间通信的接口。", "/api/stream 是前端调用的问答接口。"],
  ["HTTP", "H T T P", "后端与 API", "超文本传输协议", "浏览器和服务端通信的基础协议。", "管理接口通过 HTTP GET/POST 返回 JSON。"],
  ["WebSocket", "web socket", "后端与 API", "WebSocket 协议", "浏览器和服务端之间的双向长连接协议。", "/api/stream 使用 WebSocket 传输流式事件。"],
  ["Endpoint", "end point", "后端与 API", "接口端点", "一个可被访问的 API 路径和方法组合。", "/api/admin/status 是状态页 endpoint。"],
  ["Route", "route", "后端与 API", "路由", "把 URL 请求映射到处理函数的规则。", "qa_core.api.pages 定义页面路由。"],
  ["Router", "router", "后端与 API", "路由器", "一组相关路由的集合。", "app.include_router 注册 chat、admin、pages 路由。"],
  ["Middleware", "middle ware", "后端与 API", "中间件", "请求进入业务逻辑前后执行的通用处理层。", "CORS middleware 用于跨域调试。"],
  ["CORS", "C O R S", "后端与 API", "跨源资源共享", "浏览器限制跨域请求时使用的一套安全机制和响应头。", "app.py 配置 CORSMiddleware。"],
  ["Static Files", "static files", "后端与 API", "静态文件", "HTML、CSS、JS、图片等不需要动态生成的资源。", "app.mount('/static', StaticFiles(...)) 挂载前端资源。"],
  ["FileResponse", "file response", "后端与 API", "文件响应", "FastAPI 中直接返回本地文件内容的响应类型。", "页面路由用 FileResponse 返回 HTML。"],
  ["Request", "request", "后端与 API", "请求", "客户端发给服务端的一次调用。", "每个 request 都会创建新的 RAGQueryContext。"],
  ["Response", "response", "后端与 API", "响应", "服务端返回给客户端的数据。", "健康检查 response 包含 status 字段。"],
  ["Payload", "payload", "后端与 API", "载荷；请求体数据", "请求或事件中真正承载业务内容的数据。", "from_ws_payload 从 WebSocket payload 解析 query。"],
  ["Schema", "schema", "后端与 API", "数据结构；模式", "定义字段、类型和约束的数据形状。", "Pydantic schema 用于 API 请求和响应模型。"],
  ["Pydantic", "pydantic", "后端与 API", "Pydantic 数据校验库", "Python 中常用的数据模型和类型校验库。", "appendix-a 介绍 Pydantic。"],
  ["Dependency", "dependency", "后端与 API", "依赖", "代码运行需要的库、服务或注入对象。", "qa_core.api.dependencies 管理 API 依赖。"],
  ["Authentication", "authentication", "后端与 API", "身份认证", "确认请求者身份的过程。", "admin token 是轻量管理接口认证方式。"],
  ["Authorization", "authorization", "后端与 API", "授权", "确认某个身份是否有权限执行操作或访问数据。", "allowed_roles 用于资料可见性授权过滤。"],
  ["Session", "session", "后端与 API", "会话", "同一个用户连续多轮对话的上下文单元。", "session_id 用于保存聊天历史。"],
  ["Session ID", "session I D", "后端与 API", "会话标识", "唯一标记一次对话会话的字符串。", "create_session 返回 scenario_id:uuid 格式的 session_id。"],
  ["UUID", "U U I D", "后端与 API", "通用唯一标识符", "用于生成低冲突概率唯一 ID 的标准格式。", "uuid4 用于创建 session 和 trace ID。"],
  ["Async", "async", "后端与 API", "异步", "程序等待 IO 时不阻塞其他任务的执行方式。", "FastAPI 和 WebSocket 路由使用 async def。"],
  ["Uvicorn", "uvicorn", "后端与 API", "ASGI 服务器", "运行 FastAPI 等 Python 异步 Web 应用的服务器。", "python -m uvicorn app:app 启动服务。"],
  ["LangChain", "lang chain", "LLM 与提示词", "LangChain 框架", "用于组织大模型、提示词、检索、记忆和工具调用的框架。", "项目使用 LangChain 组织 RAG 主链路组件。"],
  ["LLM", "L L M", "LLM 与提示词", "大语言模型", "Large Language Model，能够理解和生成自然语言的模型。", "LLM 根据检索上下文生成最终回答。"],
  ["ChatOpenAI", "chat open A I", "LLM 与提示词", "OpenAI 兼容聊天模型客户端", "LangChain 中调用 OpenAI 风格聊天接口的模型封装。", "DashScope OpenAI-compatible API 可通过 ChatOpenAI 调用。"],
  ["DashScope", "dash scope", "LLM 与提示词", "通义千问模型服务平台", "阿里云模型服务，本项目可通过 OpenAI-compatible API 接入。", "LLM 配置里需要 DashScope API Key。"],
  ["OpenAI Compatible", "open A I compatible", "LLM 与提示词", "OpenAI 兼容", "服务接口遵循 OpenAI API 风格，方便复用客户端。", "DashScope 使用 OpenAI-compatible endpoint。"],
  ["Prompt", "prompt", "LLM 与提示词", "提示词", "发送给大模型的指令、上下文和用户问题组合。", "prepare_answer 会构造 system prompt 和 user prompt。"],
  ["System Prompt", "system prompt", "LLM 与提示词", "系统提示词", "用于规定模型角色、边界和回答规则的高优先级提示词。", "Prompt Profile 会选择不同 system prompt。"],
  ["User Prompt", "user prompt", "LLM 与提示词", "用户提示词", "包含用户问题和参考资料的模型输入。", "user_prompt 中会注入检索上下文。"],
  ["Prompt Profile", "prompt profile", "LLM 与提示词", "提示词配置档", "针对费用、合规、排障、总结等不同问题类型选择的回答策略。", "pricing_guard 和 compliance_guard 都是 Prompt Profile。"],
  ["Prompt Routing", "prompt routing", "LLM 与提示词", "提示词路由", "根据问题类型选择合适提示词模板的过程。", "费用类问题会路由到 pricing_guard。"],
  ["Intent", "intent", "LLM 与提示词", "意图", "用户问题背后的目标或类型，例如知识咨询、追问、越界、转人工。", "classify_intent 负责意图识别。"],
  ["Intent Classification", "intent classification", "LLM 与提示词", "意图分类", "判断用户问题属于哪种意图的过程。", "docs/05-intent-classification.md 介绍意图分类。"],
  ["Follow-up", "follow up", "LLM 与提示词", "追问", "依赖前文上下文才能完整理解的后续问题。", "rewrite_query_if_needed 会处理追问改写。"],
  ["Rewrite", "rewrite", "LLM 与提示词", "改写", "把省略、指代或口语化问题改成更适合检索的完整查询。", "query rewrite variants 会生成多个检索表达。"],
  ["Query", "query", "LLM 与提示词", "查询；问题", "用户输入的问题，或用于检索的文本。", "query 字段从 WebSocket payload 中解析。"],
  ["Query Variants", "query variants", "LLM 与提示词", "查询变体", "同一个问题的多个等价表达，用来提高召回。", "generate_query_variants 生成启发式和语义改写。"],
  ["Guard", "guard", "LLM 与提示词", "保护规则；护栏", "限制系统在高风险问题上乱答或越界的规则。", "pricing_guard 用于费用类问题。"],
  ["Guardrail", "guard rail", "LLM 与提示词", "护栏；守卫约束", "保证系统行为不偏离预期的规则、检查或测试。", "check_project_guardrails.py 检查项目守护约束。"],
  ["Out of Scope", "out of scope", "LLM 与提示词", "超出范围", "问题不属于当前系统或当前业务场景可回答范围。", "彩票怎么买会被判定为 out of scope。"],
  ["Temperature", "temperature", "LLM 与提示词", "温度参数", "控制模型生成随机性的参数，越低越稳定。", "企业问答通常使用较低 temperature。"],
  ["Agent", "agent", "LLM 与提示词", "智能体", "能根据目标规划步骤、调用工具并执行任务的模型驱动组件。", "项目一期只做 RAG，二期再引入 Agent。"],
  ["LangGraph", "lang graph", "LLM 与提示词", "LangGraph 工作流框架", "用于构建图状、可控、可恢复 Agent 工作流的框架。", "二期适合用 LangGraph 新建 Agent 模块。"],
  ["GraphRAG", "graph rag", "LLM 与提示词", "图谱增强 RAG", "利用实体关系图谱辅助检索和推理的 RAG 形态。", "GraphRAG 适合关系链明显的问题。"],
  ["MySQL", "my S Q L", "数据与治理", "MySQL 数据库", "关系型数据库，本项目用于聊天历史、摘要、反馈和管理元数据。", "知识检索由 Milvus 负责，会话状态由 MySQL 负责。"],
  ["Database", "database", "数据与治理", "数据库", "持久化存储结构化或半结构化数据的系统。", "Milvus database 和 MySQL database 各自承担不同职责。"],
  ["Table", "table", "数据与治理", "表格；数据库表", "结构化行列数据，在数据库或 Excel/CSV 中都常见。", "表格资料会转换为行级 Document。"],
  ["CSV", "C S V", "数据与治理", "逗号分隔值文件", "Comma-Separated Values，常见表格文本格式。", "faq.csv 保存标准问答。"],
  ["Excel", "excel", "数据与治理", "Excel 表格", "常见电子表格文件，扩展名通常是 .xlsx。", "payment_terms_risk_matrix.xlsx 是表格资料。"],
  ["XLSX", "X L S X", "数据与治理", "Excel 工作簿格式", "Microsoft Excel 的常用文件格式。", "项目支持 XLSX 入库。"],
  ["DOCX", "D O C X", "数据与治理", "Word 文档格式", "Microsoft Word 的常用文档格式。", "bid_document_authorization_checklist.docx 是样例资料。"],
  ["PPTX", "P P T X", "数据与治理", "PowerPoint 演示文稿格式", "Microsoft PowerPoint 的常用文件格式。", "performance_warning_briefing.pptx 是演示资料。"],
  ["PDF", "P D F", "数据与治理", "便携式文档格式", "Portable Document Format，常用于固定版式文档。", "项目支持 PDF 和 OCR 处理。"],
  ["Markdown", "markdown", "数据与治理", "Markdown 文档", "轻量级文本标记格式，适合写文档和知识资料。", "场景数据中大量 .md 文件用于知识库入库。"],
  ["OCR", "O C R", "数据与治理", "光学字符识别", "从扫描件或图片中识别文字的技术。", "run_offline_ocr.py 生成待复核 Markdown 和 OCR 报告。"],
  ["PaddleOCR", "paddle O C R", "数据与治理", "PaddleOCR 文字识别工具", "基于 PaddlePaddle 生态的 OCR 工具。", "项目离线 OCR 可使用 PaddleOCR。"],
  ["PyMuPDF", "pie mu P D F", "数据与治理", "PDF 处理库", "Python 中用于读取、渲染和处理 PDF 的库。", "OCR 流程中可用 PyMuPDF 处理扫描件。"],
  ["Ingestion", "ingestion", "数据与治理", "入库；数据摄取", "把文档、FAQ、表格等资料解析、切分、向量化并写入检索库。", "docs/16-ingestion-pipeline.md 讲 ingestion pipeline。"],
  ["IndexManifest", "index manifest", "数据与治理", "索引清单", "记录入库文件、指纹、chunk 和版本信息的清单。", "IndexManifest 支持增量入库机制。"],
  ["SHA256", "S H A two fifty six", "数据与治理", "SHA-256 哈希算法", "常用加密哈希算法，可生成文件指纹。", "appendix-b 介绍 sha256 fingerprint。"],
  ["Fingerprint", "fingerprint", "数据与治理", "指纹", "用于识别文件内容是否变化的哈希值。", "文件 fingerprint 用于判断是否需要重新入库。"],
  ["Knowledge Base", "knowledge base", "数据与治理", "知识库", "用于问答系统检索的结构化知识集合。", "项目支持多场景知识库版本。"],
  ["KB Version", "K B version", "数据与治理", "知识库版本", "一次知识库内容构建和激活的版本标识。", "active_kb_version 控制线上检索版本。"],
  ["Active Version", "active version", "数据与治理", "当前激活版本", "线上请求实际使用的知识库版本。", "resolve_active_kb_version 返回 active version。"],
  ["Candidate Version", "candidate version", "数据与治理", "候选版本", "准备评测或对比但尚未正式激活的版本。", "base/candidate 对比用于发现召回退化。"],
  ["Rollback", "roll back", "数据与治理", "回滚", "将系统或版本恢复到之前稳定状态。", "知识库版本治理需要支持激活和回滚。"],
  ["Data Scope", "data scope", "数据与治理", "数据域；数据范围", "由租户、数据集、可见级别和角色共同决定的可检索范围。", "DataScope 会参与 Milvus 过滤表达式构造。"],
  ["Tenant", "tenant", "数据与治理", "租户", "多租户系统中隔离数据和配置的客户或组织单元。", "tenant_id 写入 metadata 参与检索过滤。"],
  ["Dataset ID", "dataset I D", "数据与治理", "数据集标识", "标记资料属于哪个数据集的字段。", "dataset_id 和 tenant_id 一起限定资料范围。"],
  ["Visibility", "visibility", "数据与治理", "可见级别", "资料对 public、internal、private 等角色的可见范围。", "visibility 字段参与权限过滤。"],
  ["Allowed Roles", "allowed roles", "数据与治理", "允许角色", "可以访问某条资料的角色列表。", "allowed_roles 写入 metadata 并参与检索。"],
  ["Data Isolation", "data isolation", "数据与治理", "数据隔离", "保证不同租户、数据集、角色或场景之间不能错误互相访问。", "docs/15-data-isolation.md 讲数据隔离。"],
  ["Governance", "governance", "数据与治理", "治理", "对数据质量、版本、权限、流程和风险进行规范管理。", "qa_core.governance 负责 KB 版本和数据范围。"],
  ["Overlay", "overlay", "数据与治理", "增强覆盖包", "在基础教学数据上叠加的企业仿真增强资料。", "clean overlay 可用于后续入库增强。"],
  ["Dirty Samples", "dirty samples", "数据与治理", "脏样本", "包含噪声、冲突、过期口径或低质量内容的样本。", "dirty_samples 只用于资料治理演示。"],
  ["Clean Overlay", "clean overlay", "数据与治理", "干净增强包", "通过质量检查、可作为候选入库资料的增强数据。", "clean_overlay 目录保存企业仿真增强资料。"],
  ["Conflict", "conflict", "数据与治理", "冲突", "FAQ、正文或资料版本之间存在不一致口径。", "qa_core.quality.conflicts 检测冲突风险。"],
  ["Configuration", "configuration", "工程工具", "配置", "控制系统行为的参数和文件。", "scenario.toml 和 rules.toml 都是配置文件。"],
  ["Settings", "settings", "工程工具", "设置", "运行时环境变量和配置合并后的应用参数。", "get_settings() 使用 lru_cache 作为进程级资源。"],
  ["Environment", "environment", "工程工具", "环境", "程序运行依赖的变量、服务、系统和路径。", ".env.local.example 是本机 API 调试环境模板。"],
  ["Environment Variable", "environment variable", "工程工具", "环境变量", "通过系统环境注入程序配置的键值对。", "ADMIN_API_TOKEN 可作为环境变量传入。"],
  ["Docker", "docker", "工程工具", "容器工具 Docker", "用于打包和运行隔离应用环境的容器平台。", "Dockerfile 定义 API 镜像构建。"],
  ["Docker Compose", "docker compose", "工程工具", "Docker 编排工具", "用配置文件启动多个容器服务的工具。", "docker-compose.yml 管理 API、MySQL、Milvus 等服务。"],
  ["Container", "container", "工程工具", "容器", "封装应用和依赖的隔离运行单元。", "API 容器通过服务名访问 mysql 和 milvus。"],
  ["Image", "image", "工程工具", "镜像", "容器运行前的只读模板。", "Dockerfile 构建 API image。"],
  ["Volume", "volume", "工程工具", "数据卷", "容器外部持久化保存数据的挂载空间。", "数据库通常需要 volume 保存数据。"],
  ["Port", "port", "工程工具", "端口", "网络服务监听的数字地址。", "FastAPI 默认可运行在 8000 端口。"],
  ["Host", "host", "工程工具", "主机", "运行服务或容器的机器，也可指网络主机名。", "本机调试通常使用 localhost。"],
  ["Localhost", "local host", "工程工具", "本地主机", "当前机器自己的网络地址，通常是 127.0.0.1。", ".env.local.example 使用 localhost 端口。"],
  ["Dependency Lock", "dependency lock", "工程工具", "依赖锁定", "固定依赖版本，降低不同环境安装结果不一致的风险。", "requirements.lock.txt 保存锁定版本。"],
  ["Requirements", "requirements", "工程工具", "依赖清单", "Python 项目中列出需要安装的包和版本的文件。", "requirements.txt 包含 fastapi、langchain、pymilvus。"],
  ["Pytest", "pie test", "工程工具", "Python 测试框架", "常用 Python 自动化测试工具。", "python -m pytest tests -q 运行测试。"],
  ["Unit Test", "unit test", "工程工具", "单元测试", "验证单个函数、类或模块行为的自动化测试。", "tests/ 下有意图、检索、权限等单元测试。"],
  ["Mock", "mock", "工程工具", "模拟对象", "测试中替代真实外部依赖的假对象。", "单元测试避免依赖真实网络和服务。"],
  ["Script", "script", "工程工具", "脚本", "用于自动化执行某类任务的小程序。", "scripts/ 目录保存验收、评测和入库脚本。"],
  ["CLI", "C L I", "工程工具", "命令行界面", "Command Line Interface，通过命令操作程序。", "多数 scripts 都提供 CLI 参数。"],
  ["Argument", "argument", "工程工具", "参数", "传给函数或命令行程序的输入值。", "--scenario 是重建知识库脚本的 argument。"],
  ["Cache", "cache", "工程工具", "缓存", "保存可复用结果，减少重复计算或加载。", "@lru_cache(maxsize=1) 用于进程级资源缓存。"],
  ["Singleton", "single ton", "工程工具", "单例", "整个进程中只创建一个共享实例的对象模式。", "QAService 可以作为进程级 service singleton。"],
  ["Facade", "facade", "工程工具", "门面模式", "给复杂子系统提供一个简洁稳定的对外接口。", "QAService 被设计成 facade，而不是 pipeline 实现。"],
  ["Dataclass", "data class", "工程工具", "数据类", "Python 中用于声明结构化数据对象的便捷方式。", "RetrievalPlan 和 RAGQueryContext 使用 dataclass。"],
  ["Frozen", "frozen", "工程工具", "冻结的；不可变的", "dataclass 中表示对象创建后字段不可修改。", "不可变决策输出可使用 frozen=True。"],
  ["Type Hint", "type hint", "工程工具", "类型标注", "在 Python 代码中标明变量、参数或返回值类型。", "项目偏好 str | None、list[str] 这类显式标注。"],
  ["Exception", "exception", "工程工具", "异常", "程序运行中发生的错误或特殊情况。", "流式边界要捕获 exception 并发送 error event。"],
  ["Fallback", "fallback", "工程工具", "降级；兜底", "主路径失败时转用的替代路径。", "项目守护检查禁止恢复旧版 rag_qa fallback。"],
  ["Refactor", "refactor", "工程工具", "重构", "在不改变外部行为的前提下改善代码结构。", "拆分 pages、chat、admin 路由就是结构性重构。"],
  ["Deployment", "deployment", "工程工具", "部署", "把应用发布到可运行环境的过程。", "deploy_docker.ps1 用于 Docker 部署演示。"],
  ["Build", "build", "工程工具", "构建", "把代码、依赖和资源准备成可运行产物。", "Docker build 会生成 API 镜像。"],
  ["Versioning", "versioning", "工程工具", "版本管理", "给代码、知识库或数据结构变化分配版本并管理生命周期。", "VERSIONING.md 说明项目版本策略。"],
  ["Git", "git", "工程工具", "Git 版本控制", "跟踪代码变更、分支和提交历史的工具。", "git status 可查看当前工作区改动。"],
  ["Repository", "repository", "工程工具", "代码仓库", "保存项目代码、文档和历史版本的目录或远程地址。", "knowforge-rag-platform 是当前 repository。"],
  ["Branch", "branch", "工程工具", "分支", "Git 中并行开发的一条代码线。", "功能开发通常在独立 branch 完成。"],
  ["Commit", "commit", "工程工具", "提交", "Git 中保存一组文件改动的历史记录。", "完成修改后可以 commit 词汇网站文件。"],
  ["Frontend", "front end", "前端页面", "前端", "用户在浏览器中看到并交互的页面部分。", "static/ 目录保存原生前端页面。"],
  ["Backend", "back end", "前端页面", "后端", "处理业务逻辑、数据和 API 的服务端部分。", "FastAPI 是项目 backend。"],
  ["HTML", "H T M L", "前端页面", "超文本标记语言", "网页结构语言。", "index.html 是词汇站点入口。"],
  ["CSS", "C S S", "前端页面", "层叠样式表", "控制网页布局、颜色、字体和响应式表现的样式语言。", "styles.css 定义词汇站点视觉样式。"],
  ["JavaScript", "java script", "前端页面", "JavaScript 脚本语言", "浏览器中实现交互逻辑的脚本语言。", "app.js 负责搜索、筛选和发音。"],
  ["DOM", "D O M", "前端页面", "文档对象模型", "浏览器把 HTML 页面表示成可被 JavaScript 操作的对象树。", "脚本通过 DOM 渲染词汇卡片。"],
  ["Responsive", "responsive", "前端页面", "响应式", "页面能适配桌面和移动端不同屏幕宽度。", "词汇站点使用 CSS grid 做 responsive 布局。"],
  ["Accessibility", "accessibility", "前端页面", "无障碍访问", "让键盘、读屏器或不同能力用户都能使用页面。", "发音按钮和搜索框都带可读标签。"],
  ["Search", "search", "前端页面", "搜索", "按关键词查找词条。", "词汇页支持英文、中文和释义搜索。"],
  ["Filter", "filter", "前端页面", "筛选", "按分类或标签缩小列表范围。", "分类按钮会筛选当前 category。"],
  ["Card", "card", "前端页面", "卡片", "用于展示单个词条信息的界面容器。", "每个词条被渲染成一张 card。"],
  ["Badge", "badge", "前端页面", "徽标；标签", "小型标签，用于展示分类或状态。", "category badge 标识词条所属主题。"],
  ["Button", "button", "前端页面", "按钮", "用户点击后触发动作的控件。", "真人朗读按钮会优先播放在线词典音频。"],
  ["Local Storage", "local storage", "前端页面", "本地存储", "浏览器提供的键值存储，可保存少量用户偏好。", "收藏词条保存在 localStorage。"],
  ["Speech Synthesis", "speech synthesis", "前端页面", "语音合成", "浏览器把文本读出来的能力。", "旧版页面曾使用语音合成；当前版本优先使用真人词典音频。"],
  ["Utterance", "utterance", "前端页面", "语音播报内容", "传给语音合成引擎的一段待朗读文本。", "这是语音合成相关概念；当前页面的主要朗读来源是真人音频。"]
].map(([term, say, category, chinese, meaning, usage]) => ({ term, say, category, chinese, meaning, usage }));

const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const DATAMUSE_API = "https://api.datamuse.com/words";
const pronunciationCache = new Map(Object.entries(JSON.parse(localStorage.getItem("knowforge-pronunciation-cache-github-pages-mw-fallback-v1") || "{}")));
let activeAudio = null;

function savePronunciationCache() {
  localStorage.setItem("knowforge-pronunciation-cache-github-pages-mw-fallback-v1", JSON.stringify(Object.fromEntries(pronunciationCache)));
}

function cleanIpa(text) {
  const value = String(text || "").trim().replace(/^\/+|\/+$/g, "");
  return value ? `/${value}/` : "";
}

function audioUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.startsWith("//") ? `https:${raw}` : raw;
}

function lookupTokens(word) {
  const source = String(word.say || word.term || "")
    .replace(/[,_/()]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  const tokens = source
    .split(/\s+|-/)
    .map((part) => part.toLowerCase().replace(/[^a-z']/g, ""))
    .filter((part) => part.length > 1 && part !== "and" && part !== "or");
  return [...new Set(tokens)].slice(0, 5);
}

function selectDictionaryEntry(entries) {
  const phonetics = entries.flatMap((entry) => entry.phonetics || []);
  const audioCandidates = phonetics.filter((item) => item.audio);
  const preferredAudio = audioCandidates.find((item) => /(?:^|[-_])us(?:[-_]|\.)|en-us/i.test(item.audio)) || audioCandidates[0];
  const textCandidates = phonetics.filter((item) => item.text);
  const preferredText = preferredAudio?.text || textCandidates[0]?.text || entries.find((entry) => entry.phonetic)?.phonetic || "";
  return {
    ipa: cleanIpa(preferredText),
    audio: audioUrl(preferredAudio?.audio),
  };
}

function hasMerriamWebsterKey() {
  return MW_API_KEY && MW_API_KEY !== "PASTE_YOUR_MERRIAM_WEBSTER_KEY_HERE";
}

function merriamAudioDirectory(audio) {
  if (/^bix/i.test(audio)) return "bix";
  if (/^gg/i.test(audio)) return "gg";
  if (/^[0-9]/.test(audio)) return "number";
  return audio.charAt(0);
}

function merriamAudioUrl(audio) {
  const value = String(audio || "").trim();
  if (!value) return "";
  const directory = merriamAudioDirectory(value);
  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${directory}/${value}.mp3`;
}

function selectMerriamWebsterEntry(entries) {
  const realEntries = Array.isArray(entries) ? entries.filter((entry) => entry && typeof entry === "object") : [];
  const pronunciations = realEntries.flatMap((entry) => entry.hwi?.prs || []);
  const preferred = pronunciations.find((item) => item.sound?.audio) || pronunciations[0] || {};
  return {
    ipa: cleanIpa(preferred.ipa || preferred.mw),
    audio: merriamAudioUrl(preferred.sound?.audio),
    source: "merriam-webster-collegiate",
  };
}

async function fetchMerriamWebsterPronunciation(token) {
  if (!hasMerriamWebsterKey()) return { ipa: "", audio: "", missing: true };
  try {
    const response = await fetch(`${MW_COLLEGIATE_API}${encodeURIComponent(token)}?key=${encodeURIComponent(MW_API_KEY)}`);
    if (!response.ok) throw new Error(`mw status ${response.status}`);
    return selectMerriamWebsterEntry(await response.json());
  } catch (error) {
    return { ipa: "", audio: "", missing: true };
  }
}
function parseDatamuseIpa(items) {
  const first = Array.isArray(items) ? items[0] : null;
  const tags = first?.tags || [];
  const pron = tags.find((tag) => String(tag).startsWith("pron:"));
  return cleanIpa(pron ? pron.slice(5) : "");
}

async function fetchDatamuseIpa(token) {
  try {
    const params = new URLSearchParams({ sp: token, qe: "sp", md: "r", ipa: "1", max: "1" });
    const response = await fetch(`${DATAMUSE_API}?${params.toString()}`);
    if (!response.ok) throw new Error(`datamuse status ${response.status}`);
    return parseDatamuseIpa(await response.json());
  } catch (error) {
    return "";
  }
}
async function fetchTokenPronunciation(token) {
  if (pronunciationCache.has(token)) return pronunciationCache.get(token);

  let result = { ipa: "", audio: "", missing: true, source: "none" };
  try {
    const response = await fetch(`${DICTIONARY_API}${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error(`dictionary status ${response.status}`);
    const entries = await response.json();
    result = selectDictionaryEntry(Array.isArray(entries) ? entries : []);
    result.source = "dictionaryapi-dev";
  } catch (error) {
    result = { ipa: "", audio: "", missing: true, source: "dictionaryapi-dev-miss" };
  }

  if (!result.ipa) {
    result.ipa = await fetchDatamuseIpa(token);
    if (result.ipa && result.source === "dictionaryapi-dev-miss") result.source = "datamuse";
  }

  // Merriam-Webster uses a personal API key, so keep it as the final fallback.
  if (!result.audio || !result.ipa) {
    const mwResult = await fetchMerriamWebsterPronunciation(token);
    result = {
      ipa: result.ipa || mwResult.ipa,
      audio: result.audio || mwResult.audio,
      source: mwResult.audio || mwResult.ipa ? `fallback:${mwResult.source || "merriam-webster"}` : result.source,
      missing: !(result.ipa || result.audio || mwResult.ipa || mwResult.audio),
    };
  }

  pronunciationCache.set(token, result);
  savePronunciationCache();
  return result;
}

async function loadPronunciation(word) {
  if (word.pronunciation) return word.pronunciation;
  const tokens = lookupTokens(word);
  const results = await Promise.all(tokens.map(fetchTokenPronunciation));
  const ipa = [...new Set(results.map((item) => item.ipa).filter(Boolean))].join(" ");
  const audioUrls = [...new Set(results.map((item) => item.audio).filter(Boolean))];
  word.pronunciation = {
    ipa,
    audioUrls,
    status: audioUrls.length ? "ready" : ipa ? "ipa-only" : "missing",
  };
  return word.pronunciation;
}

function updatePronunciationCard(card, pronunciation) {
  if (!card) return;
  const ipaValue = card.querySelector(".ipa-value");
  const audioStatus = card.querySelector(".audio-status");
  const speakButton = card.querySelector('[data-action="speak"]');
  if (ipaValue) ipaValue.textContent = pronunciation.ipa || "暂无 IPA";
  if (audioStatus) {
    audioStatus.textContent = pronunciation.audioUrls.length ? "真人音频已就绪" : pronunciation.ipa ? "IPA 已补齐，暂无真人音频" : "暂无 IPA / 真人音频";
    audioStatus.classList.toggle("ready", Boolean(pronunciation.audioUrls.length));
  }
  if (speakButton) {
    speakButton.disabled = !pronunciation.audioUrls.length;
    speakButton.classList.toggle("disabled", !pronunciation.audioUrls.length);
    speakButton.textContent = pronunciation.audioUrls.length ? "听" : "无";
    speakButton.title = pronunciation.audioUrls.length ? "播放真人朗读" : "暂未找到真人音频";
  }
}

async function hydratePronunciationCard(card) {
  if (!card || card.dataset.pronunciationLoaded === "1") return;
  card.dataset.pronunciationLoaded = "1";
  const word = WORDS.find((item) => item.term === card.dataset.term);
  if (!word) return;
  const pronunciation = await loadPronunciation(word);
  updatePronunciationCard(card, pronunciation);
}

const pronunciationObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        pronunciationObserver.unobserve(entry.target);
        hydratePronunciationCard(entry.target);
      });
    }, { rootMargin: "220px" })
  : null;

function observePronunciationCards() {
  els.wordGrid.querySelectorAll(".word-card").forEach((card) => {
    if (pronunciationObserver) {
      pronunciationObserver.observe(card);
    } else {
      hydratePronunciationCard(card);
    }
  });
}

function playAudio(url) {
  return new Promise((resolve, reject) => {
    if (activeAudio) activeAudio.pause();
    const audio = new Audio(url);
    activeAudio = audio;
    audio.addEventListener("ended", resolve, { once: true });
    audio.addEventListener("error", reject, { once: true });
    audio.play().catch(reject);
  });
}

async function playAudioSequence(urls) {
  for (const url of urls) {
    await playAudio(url);
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  }
}

const state = {
  query: "",
  category: "全部",
  favoritesOnly: false,
  favorites: new Set(JSON.parse(localStorage.getItem("knowforge-english-favorites") || "[]")),
};

const els = {
  totalCount: document.getElementById("totalCount"),
  categoryCount: document.getElementById("categoryCount"),
  favoriteCount: document.getElementById("favoriteCount"),
  searchInput: document.getElementById("searchInput"),
  categorySelect: document.getElementById("categorySelect"),
  categoryTabs: document.getElementById("categoryTabs"),
  resultCount: document.getElementById("resultCount"),
  wordGrid: document.getElementById("wordGrid"),
  emptyState: document.getElementById("emptyState"),
  clearBtn: document.getElementById("clearBtn"),
  randomBtn: document.getElementById("randomBtn"),
  favoritesOnlyBtn: document.getElementById("favoritesOnlyBtn"),
};

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function categories() {
  return ["全部", ...Array.from(new Set(WORDS.map((word) => word.category))).sort((a, b) => a.localeCompare(b, "zh-CN"))];
}

function saveFavorites() {
  localStorage.setItem("knowforge-english-favorites", JSON.stringify([...state.favorites]));
}

function filteredWords() {
  const query = normalize(state.query);
  return WORDS
    .filter((word) => state.category === "全部" || word.category === state.category)
    .filter((word) => !state.favoritesOnly || state.favorites.has(word.term))
    .filter((word) => {
      if (!query) return true;
      return [word.term, word.say, word.category, word.chinese, word.meaning, word.usage]
        .map(normalize)
        .some((value) => value.includes(query));
    })
    .sort((a, b) => a.term.localeCompare(b.term));
}

async function speak(word, button = null) {
  if (button) {
    button.disabled = true;
    button.textContent = "...";
  }
  const pronunciation = await loadPronunciation(word);
  const card = document.querySelector(`[data-term="${CSS.escape(word.term)}"]`);
  updatePronunciationCard(card, pronunciation);

  if (!pronunciation.audioUrls.length) {
    alert(`暂时没有找到「${word.term}」的真人词典音频。`);
    return;
  }

  try {
    await playAudioSequence(pronunciation.audioUrls);
  } catch (error) {
    alert("真人音频播放失败，可能是网络或浏览器拦截了外部音频。");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "听";
    }
  }
}

function renderCategoryControls() {
  const allCategories = categories();
  els.categorySelect.innerHTML = allCategories
    .map((category) => `<option value="${category}"${category === state.category ? " selected" : ""}>${category}</option>`)
    .join("");

  els.categoryTabs.innerHTML = allCategories
    .map((category) => `<button class="tab${category === state.category ? " active" : ""}" type="button" data-category="${category}">${category}</button>`)
    .join("");
}

function renderStats() {
  els.totalCount.textContent = WORDS.length;
  els.categoryCount.textContent = categories().length - 1;
  els.favoriteCount.textContent = state.favorites.size;
}

function renderWords() {
  const words = filteredWords();
  els.resultCount.textContent = `${words.length} / ${WORDS.length} 个词条`;
  els.emptyState.style.display = words.length ? "none" : "grid";
  els.wordGrid.innerHTML = words.map((word) => {
    const favorite = state.favorites.has(word.term);
    return `
      <article class="word-card" data-term="${escapeHtml(word.term)}">
        <div class="word-top">
          <div>
            <div class="term">${escapeHtml(word.term)}</div>
                        <div class="pronounce">
              <span class="ipa-label">美式 IPA：</span><span class="ipa-value">加载中...</span>
              <span class="audio-status">正在查找真人音频</span>
            </div>
          </div>
          <div class="actions">
            <button class="mini-button speak" type="button" data-action="speak" title="播放真人朗读">...</button>
            <button class="mini-button favorite${favorite ? " active" : ""}" type="button" data-action="favorite" title="收藏">★</button>
          </div>
        </div>
        <div class="meta">
          <span class="category">${escapeHtml(word.category)}</span>
          <span class="zh">${escapeHtml(word.chinese)}</span>
        </div>
        <p class="meaning">${escapeHtml(word.meaning)}</p>
        <p class="usage"><b>项目语境：</b>${escapeHtml(word.usage)}</p>
      </article>
    `;
  }).join("");
  observePronunciationCards();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  renderCategoryControls();
  renderStats();
  renderWords();
  els.favoritesOnlyBtn.classList.toggle("active", state.favoritesOnly);
}

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderWords();
});

els.categorySelect.addEventListener("change", (event) => {
  state.category = event.target.value;
  render();
});

els.categoryTabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-category]");
  if (!tab) return;
  state.category = tab.dataset.category;
  render();
});

els.wordGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  const card = event.target.closest("[data-term]");
  if (!button || !card) return;
  const word = WORDS.find((item) => item.term === card.dataset.term);
  if (!word) return;

  if (button.dataset.action === "speak") {
    speak(word, button);
    return;
  }

  if (state.favorites.has(word.term)) {
    state.favorites.delete(word.term);
  } else {
    state.favorites.add(word.term);
  }
  saveFavorites();
  render();
});

els.clearBtn.addEventListener("click", () => {
  state.query = "";
  state.category = "全部";
  state.favoritesOnly = false;
  els.searchInput.value = "";
  render();
});

els.favoritesOnlyBtn.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  render();
});

els.randomBtn.addEventListener("click", () => {
  const words = filteredWords();
  const pool = words.length ? words : WORDS;
  const word = pool[Math.floor(Math.random() * pool.length)];
  state.query = word.term;
  els.searchInput.value = word.term;
  renderWords();
  requestAnimationFrame(() => {
    document.querySelector(`[data-term="${CSS.escape(word.term)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    speak(word);
  });
});

render();

function initVoteFireworks() {
  const overlay = document.getElementById("voteFireworkOverlay");
  const canvas = document.getElementById("voteFireworkCanvas");
  if (!overlay || !canvas) return;

  const ctx = canvas.getContext("2d");
  const colors = ["#ffe066", "#ff6b6b", "#4dabf7", "#69db7c", "#f783ac", "#b197fc"];
  const particles = [];
  let width = 0;
  let height = 0;
  let rafId = 0;
  let running = true;

  function resize() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function burst(x, y, count = 58) {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.18;
      const speed = 2.1 + Math.random() * 4.4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 66 + Math.random() * 34,
        age: 0,
        size: 2 + Math.random() * 3.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function scheduleBursts() {
    const points = [
      [0.20, 0.30], [0.78, 0.28], [0.50, 0.22], [0.30, 0.62],
      [0.72, 0.64], [0.12, 0.54], [0.88, 0.50], [0.50, 0.72],
    ];
    points.forEach(([x, y], index) => {
      window.setTimeout(() => burst(width * x, height * y, index % 2 ? 46 : 64), 220 + index * 280);
    });
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.age += 1;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.vx *= 0.99;
      const alpha = Math.max(0, 1 - particle.age / particle.life);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      if (particle.age >= particle.life) particles.splice(index, 1);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    if (running || particles.length) rafId = requestAnimationFrame(tick);
  }

  resize();
  scheduleBursts();
  tick();
  window.addEventListener("resize", resize);

  window.setTimeout(() => {
    running = false;
    overlay.remove();
    window.removeEventListener("resize", resize);
    cancelAnimationFrame(rafId);
  }, 5000);
}

initVoteFireworks();
