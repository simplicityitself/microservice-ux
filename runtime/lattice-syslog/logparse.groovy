
println "Starting log flower thingy"
BufferedReader br = new BufferedReader(new InputStreamReader(System.in))
while(true) {
  def log = br.readLine()

  def msg = parseQuote("message", log)
  def type = parseNoQuote("source_type", log)
  def app = parseQuote("app_id", log)
  def instance = parseQuote("source_instance", log)

  println "${app}[${instance}]|${type}|${msg}"
}

def parseQuote(name, log) {
def parsed = log =~ /.*?${name}:\"(.*?)\".*/
if (!parsed.matches()) return "${name}"
parsed[0][1]  
}
def parseNoQuote(name, log) {
def parsed = log =~ /.*?${name}:(.*?).*/
if (!parsed.matches()) return "${name}"
parsed[0][1]  
}
