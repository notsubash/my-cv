import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import BlogNav from './BlogNav'
import BlogToc from './BlogToc'
import CodeBlock from './CodeBlock'
import { useBlogSeo, useReadingTime } from './useBlogSeo'

function DiagramBox({ x, y, w, h, label, sublabel, accent }: { x: number; y: number; w: number; h: number; label: string; sublabel?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        className={accent ? 'fill-[hsl(var(--accent)/0.15)] stroke-[hsl(var(--accent)/0.6)]' : 'fill-[hsl(var(--card))] stroke-[hsl(var(--border))]'}
        strokeWidth={1.5}
      />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 6 : h / 2 + 1)} textAnchor="middle" dominantBaseline="middle"
        className="fill-[hsl(var(--foreground))] text-[11px] font-semibold"
      >{label}</text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" dominantBaseline="middle"
          className="fill-[hsl(var(--muted-foreground))] text-[9px]"
        >{sublabel}</text>
      )}
    </g>
  )
}

function DiagramArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len
  const uy = dy / len
  const ax = x2 - ux * 6
  const ay = y2 - uy * 6
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} className="stroke-[hsl(var(--primary)/0.5)]" strokeWidth={1.5} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 4},${ay + ux * 4} ${ax + uy * 4},${ay - ux * 4}`}
        className="fill-[hsl(var(--primary)/0.5)]"
      />
    </g>
  )
}

function LearningPathDiagram() {
  return (
    <figure className="my-6">
      <svg viewBox="0 0 640 170" className="w-full" role="img" aria-label="Learning path from classical ML to transformers">
        <DiagramBox x={10} y={10} w={90} h={50} label="Regression" sublabel="sklearn" />
        <DiagramArrow x1={100} y1={35} x2={120} y2={35} />
        <DiagramBox x={120} y={10} w={90} h={50} label="Clustering" sublabel="K-Means · DBSCAN" />
        <DiagramArrow x1={210} y1={35} x2={230} y2={35} />
        <DiagramBox x={230} y={10} w={90} h={50} label="NumPy MLP" sublabel="From scratch" accent />
        <DiagramArrow x1={320} y1={35} x2={340} y2={35} />
        <DiagramBox x={340} y={10} w={90} h={50} label="PyTorch" sublabel="Fundamentals" />
        <DiagramArrow x1={430} y1={35} x2={450} y2={35} />
        <DiagramBox x={450} y={10} w={80} h={50} label="CNNs" sublabel="CIFAR · CelebA" accent />
        <DiagramArrow x1={530} y1={35} x2={550} y2={35} />
        <DiagramBox x={550} y={10} w={80} h={50} label="RNNs" sublabel="IMDB · Char LM" accent />

        <DiagramArrow x1={275} y1={60} x2={275} y2={80} />
        <DiagramBox x={190} y={100} w={170} h={50} label="Miniprojects" sublabel="MNIST · Mileage · Smile" />

        <DiagramArrow x1={590} y1={60} x2={590} y2={80} />
        <DiagramBox x={510} y={100} w={120} h={50} label="Transformers" sublabel="Attention" accent />
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">The path: classical ML, then NumPy from-scratch, then PyTorch, branching into vision, sequences, and attention</figcaption>
    </figure>
  )
}

function GradientDescentLadder() {
  const steps = [
    { label: 'Step 1', desc: 'NumPy only', detail: 'Manual gradients, manual weight update' },
    { label: 'Step 2', desc: '+ Autograd', detail: 'PyTorch computes gradients, manual update' },
    { label: 'Step 3', desc: '+ Loss & Optim', detail: 'nn.MSELoss + optim.SGD handle the math' },
    { label: 'Step 4', desc: '+ nn.Module', detail: 'Full PyTorch model with nn.Linear' },
  ]

  return (
    <figure className="my-6">
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i + 1}
              </div>
              {i < 3 && <div className="w-px h-4 bg-border" />}
            </div>
            <div className="pt-1">
              <p className="text-xs font-semibold text-foreground">{s.desc}</p>
              <p className="text-xs text-muted-foreground">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-center text-xs text-muted-foreground mt-3">Four versions of the same linear regression, each replacing one hand-coded piece with PyTorch</figcaption>
    </figure>
  )
}

function NetworkArchDiagram() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const layers = [
    { x: 60, nodes: 6, label: 'Input (784)', color: 'hsl(var(--primary))' },
    { x: 220, nodes: 4, label: 'Hidden (100)', color: 'hsl(var(--accent))' },
    { x: 380, nodes: 3, label: 'Output (10)', color: 'hsl(var(--primary))' },
  ]
  const yStart = 20
  const ySpacing = 28

  return (
    <figure className="my-6">
      <svg viewBox="0 0 440 210" className="w-full" role="img" aria-label="MNIST MLP architecture">
        {layers.map((layer, li) => {
          const nextLayer = layers[li + 1]
          if (!nextLayer) return null
          return layer.nodes > 0 && nextLayer.nodes > 0 ? (
            <g key={`edges-${li}`}>
              {Array.from({ length: layer.nodes }).map((_, ni) =>
                Array.from({ length: nextLayer.nodes }).map((_, nj) => (
                  <line key={`${ni}-${nj}`}
                    x1={layer.x} y1={yStart + ni * ySpacing + (li === 0 ? 0 : 10)}
                    x2={nextLayer.x} y2={yStart + nj * ySpacing + (li + 1 === 0 ? 0 : 10)}
                    className="stroke-[hsl(var(--primary)/0.08)]" strokeWidth={1}
                    style={mounted ? { opacity: 1, transition: `opacity ${0.3 + (ni + nj) * 0.03}s ease-out` } : { opacity: 0 }}
                  />
                ))
              )}
            </g>
          ) : null
        })}
        {layers.map((layer, li) => (
          <g key={`nodes-${li}`}>
            {Array.from({ length: layer.nodes }).map((_, ni) => (
              <circle key={ni} cx={layer.x} cy={yStart + ni * ySpacing + (li === 0 ? 0 : 10)}
                r={8} fill={layer.color} fillOpacity={0.2} stroke={layer.color} strokeOpacity={0.6} strokeWidth={1.5}
                style={mounted ? { opacity: 1, transition: `opacity ${0.2 + ni * 0.05}s ease-out` } : { opacity: 0 }}
              />
            ))}
            <text x={layer.x} y={yStart + layer.nodes * ySpacing + (li === 0 ? 10 : 20)} textAnchor="middle"
              className="fill-[hsl(var(--muted-foreground))] text-[9px]"
            >{layer.label}</text>
            {layer.nodes < 6 && li === 0 && (
              <text x={layer.x} y={yStart + layer.nodes * ySpacing - 5} textAnchor="middle"
                className="fill-[hsl(var(--muted-foreground))] text-[8px]">···</text>
            )}
          </g>
        ))}
        <text x={140} y={100} textAnchor="middle" className="fill-[hsl(var(--accent)/0.5)] text-[8px]">ReLU</text>
        <text x={300} y={85} textAnchor="middle" className="fill-[hsl(var(--accent)/0.5)] text-[8px]">Softmax</text>
      </svg>
      <figcaption className="text-center text-xs text-muted-foreground mt-2">The MNIST MLP: 784 inputs, one hidden layer, 10 class outputs</figcaption>
    </figure>
  )
}

export default function BlogMLFromScratch() {
  useBlogSeo({
    title: 'Learning ML and Deep Learning by Building Everything Twice',
    description: 'My path through machine learning: implementing algorithms from scratch in NumPy, then rebuilding them in PyTorch. Covers linear regression, clustering, neural networks, CNNs on CIFAR-10 and CelebA, RNNs on IMDB, and transformers.',
    keywords: 'learn machine learning from scratch python, implement neural network numpy tutorial, pytorch course beginner to advanced, build cnn from scratch python, mnist classification pytorch, cifar-10 convolutional neural network, rnn sentiment analysis imdb pytorch, transfer learning resnet18 pytorch, gradient descent numpy to pytorch, xor classification neural network, backpropagation implementation python, kmeans clustering from scratch, dbscan vs hierarchical clustering, character level language model rnn, celeba smile classification cnn, how to learn deep learning step by step, pytorch nn.module tutorial, autograd backward explained, custom dataset dataloader pytorch',
    ogImage: '/og-blog-ml-from-scratch.webp',
    datePublished: '2024-01-01',
    slug: 'ml-from-scratch',
  })
  const { articleRef, readingTimeRef } = useReadingTime()

  return (
    <main className="min-h-screen bg-background">
      <BlogToc articleRef={articleRef} />
      <article ref={articleRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to blog
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> April 2026</span>
            <span className="text-border">·</span>
            <span ref={readingTimeRef}>15 min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Learning ML and Deep Learning by Building Everything Twice
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            I learned machine learning by implementing things twice: once from scratch in NumPy, then again in PyTorch. Linear regression, K-Means, a full neural network in raw NumPy that gets 94% on MNIST, then the same ideas rebuilt with autograd and <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">nn.Module</code>. Then CNNs, RNNs, transformers. This post walks through what I built and what actually stuck.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Python', 'NumPy', 'PyTorch', 'scikit-learn', 'TensorBoard', 'Deep Learning'].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground mb-6">
          All implementations are in two repositories: <a href="https://github.com/notsubash/ML-DL-implementations" className="text-primary hover:underline">ML-DL-implementations</a> (algorithms + miniprojects) and <a href="https://github.com/notsubash/Pytorch-course" className="text-primary hover:underline">PyTorch-course</a> (structured fundamentals).
        </div>

        <hr className="border-border mb-10" />

        <div className="prose-custom space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 id="approach" className="font-display text-lg font-semibold text-foreground mb-3">The approach: scratch first, framework second</h2>
            <p>
              When I first started learning ML, I jumped straight to <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">model.fit()</code> and figured I understood what was going on. Then someone asked me what the gradient of MSE loss looks like and I had nothing. I couldn't explain what was happening inside the model I'd just trained.
            </p>
            <p className="mt-3">
              So I went back and implemented everything in NumPy first, where you have to write every matrix multiply and gradient update yourself. Then I'd rebuild it in PyTorch to learn the framework. The NumPy version forces understanding. The PyTorch version teaches you how to actually ship things.
            </p>
            <LearningPathDiagram />
          </section>

          <section>
            <h2 id="classical-ml" className="font-display text-lg font-semibold text-foreground mb-3">Classical ML: getting the foundations right</h2>
            <p>
              Regression and clustering first, because they're small enough to fully understand and they force you through the basics: feature scaling, distance metrics, loss functions.
            </p>

            <h3 id="regression" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Regression on real housing data</h3>
            <p>
              Linear and polynomial regression on the <strong className="text-foreground">Ames Housing</strong> dataset. On synthetic data, going from linear to quadratic dropped MSE from 570 to 61 and pushed R² from 0.83 to 0.98. On the full housing dataset with dozens of features, the gains were less clean. Picking which features to include and how to scale them mattered more than whether I used degree 2 or degree 3.
            </p>
            <CodeBlock lang="python" code={`from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Quadratic features capture nonlinear relationships
poly = PolynomialFeatures(degree=2)
X_quad = poly.fit_transform(X)

model = LinearRegression()
model.fit(X_quad, y)

y_pred = model.predict(X_quad)
print(f"MSE: {mean_squared_error(y, y_pred):.2f}")    # 61.33
print(f"R²:  {r2_score(y, y_pred):.3f}")              # 0.982`} />

            <h3 id="clustering" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Three flavors of clustering</h3>
            <p>
              Running <strong className="text-foreground">K-Means</strong>, <strong className="text-foreground">hierarchical clustering</strong>, and <strong className="text-foreground">DBSCAN</strong> on the same data made the tradeoffs obvious. K-Means needs K upfront and assumes roughly spherical clusters. Hierarchical gives you a dendrogram so you can pick K after looking at the data. DBSCAN skips K entirely and handles weird shapes, but epsilon and min-samples need tuning.
            </p>
            <p className="mt-3">
              The <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">make_moons</code> dataset is the best demonstration of why DBSCAN exists. K-Means splits the two crescents vertically. DBSCAN traces their actual shape.
            </p>
          </section>

          <section>
            <h2 id="numpy-mlp" className="font-display text-lg font-semibold text-foreground mb-3">The NumPy neural network: 94% on MNIST with no framework</h2>
            <p>
              This was the exercise that taught me the most. A multi-layer perceptron in raw NumPy means writing everything yourself: forward pass, activations, loss computation, backprop, weight updates. There's no framework hiding the math from you.
            </p>
            <CodeBlock lang="python" code={`class NeuralNetMLP:
    def __init__(self, num_features, num_hidden, num_classes):
        self.num_features = num_features
        self.num_hidden = num_hidden
        self.num_classes = num_classes

        # Xavier initialization
        rng = np.random.RandomState(123)
        self.weight_h = rng.normal(
            loc=0.0, scale=0.1, size=(num_hidden, num_features)
        )
        self.bias_h = np.zeros(num_hidden)
        self.weight_out = rng.normal(
            loc=0.0, scale=0.1, size=(num_classes, num_hidden)
        )
        self.bias_out = np.zeros(num_classes)`} />
            <NetworkArchDiagram />
            <p className="mt-3">
              Forward pass: matrix multiply, add bias, sigmoid. Backward pass: chain rule, step by step, from output error back to input gradients. It's tedious to write out. But once you've manually coded the backward pass for a two-layer network, <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">loss.backward()</code> stops feeling like a black box.
            </p>
            <p className="mt-3">
              On MNIST with a single hidden layer of 100 units: <strong className="text-foreground">~94.5% test accuracy</strong>. Training reached about 95.6%, so not much overfitting. A PyTorch version with the same architecture gives the same numbers. The math is identical; the only difference is who typed the matrix multiplications.
            </p>
          </section>

          <section>
            <h2 id="pytorch-fundamentals" className="font-display text-lg font-semibold text-foreground mb-3">PyTorch: replacing hand-coded pieces one at a time</h2>
            <p>
              Instead of jumping from NumPy to full PyTorch, I wrote the same linear regression four times. Each version replaced one hand-coded piece with a PyTorch equivalent. Doing this made each abstraction layer click in a way that reading docs never did.
            </p>
            <GradientDescentLadder />

            <h3 id="step1-numpy" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Step 1: Pure NumPy</h3>
            <p>
              Manual everything. Compute the prediction, the loss, and the gradient by hand. Update weights with a learning rate.
            </p>
            <CodeBlock lang="python" code={`# Pure NumPy: manual gradients, manual update
X = np.array([1, 2, 3, 4], dtype=np.float32)
Y = np.array([2, 4, 6, 8], dtype=np.float32)
w = 0.0

def forward(x): return w * x
def loss(y, y_pred): return ((y_pred - y) ** 2).mean()
def gradient(x, y, y_pred): return np.dot(2 * x, (y_pred - y)).mean()

for epoch in range(20):
    y_pred = forward(X)
    l = loss(Y, y_pred)
    dw = gradient(X, Y, y_pred)
    w -= 0.01 * dw`} />

            <h3 id="step2-autograd" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Step 2: Tensors + autograd</h3>
            <p>
              Keep the same regression and manual update rule, but move to tensors and let autograd compute the gradient.
            </p>
            <CodeBlock lang="python" code={`import torch

X = torch.tensor([1, 2, 3, 4], dtype=torch.float32)
Y = torch.tensor([2, 4, 6, 8], dtype=torch.float32)
w = torch.tensor(0.0, dtype=torch.float32, requires_grad=True)

def forward(x): return w * x
def loss(y, y_pred): return ((y_pred - y) ** 2).mean()

for epoch in range(20):
    y_pred = forward(X)
    l = loss(Y, y_pred)
    l.backward()

    with torch.no_grad():
        w -= 0.01 * w.grad
        w.grad.zero_()`} />

            <h3 id="step3-loss-optim" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Step 3: Built-in loss + optimizer</h3>
            <p>
              Next, replace hand-written loss and update logic with <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">nn.MSELoss</code> and <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">optim.SGD</code>. The model is still just one scalar weight.
            </p>
            <CodeBlock lang="python" code={`import torch
import torch.nn as nn

X = torch.tensor([1, 2, 3, 4], dtype=torch.float32)
Y = torch.tensor([2, 4, 6, 8], dtype=torch.float32)
w = torch.tensor(0.0, dtype=torch.float32, requires_grad=True)

criterion = nn.MSELoss()
optimizer = torch.optim.SGD([w], lr=0.01)

for epoch in range(20):
    y_pred = w * X
    l = criterion(y_pred, Y)
    l.backward()
    optimizer.step()
    optimizer.zero_grad()`} />

            <h3 id="step4-module" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Step 4: Full nn.Module</h3>
            <p>
              Same regression, same data. PyTorch handles gradients, loss, optimization, and the model. Half the code, same math, and it handles edge cases you'd miss writing it by hand.
            </p>
            <CodeBlock lang="python" code={`import torch
import torch.nn as nn

X = torch.tensor([[1], [2], [3], [4]], dtype=torch.float32)
Y = torch.tensor([[2], [4], [6], [8]], dtype=torch.float32)

class LinearRegression(nn.Module):
    def __init__(self, input_dim, output_dim):
        super().__init__()
        self.lin = nn.Linear(input_dim, output_dim)

    def forward(self, x):
        return self.lin(x)

model = LinearRegression(1, 1)
criterion = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

for epoch in range(100):
    y_pred = model(X)
    l = criterion(y_pred, Y)
    l.backward()
    optimizer.step()
    optimizer.zero_grad()`} />
            <p className="mt-3">
              What clicked for me: <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">l.backward()</code> is doing the same thing as the manual gradient function from Step 1, just generalized to arbitrary computation graphs. <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">optimizer.step()</code> is <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">w -= lr * dw</code> applied to every parameter. No magic.
            </p>
          </section>

          <section>
            <h2 id="xor" className="font-display text-lg font-semibold text-foreground mb-3">XOR: the case for depth</h2>
            <p>
              XOR: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0. Four data points, and no single line can separate the classes. A single-layer network tops out at 50% because the boundary isn't linear.
            </p>
            <p className="mt-3">
              Add one hidden layer with ReLU and it jumps to <strong className="text-foreground">~95% on training</strong>, <strong className="text-foreground">~90% on validation</strong>. I like this example more than MNIST for explaining why depth matters. You can plot the decision boundary and literally see where the single-layer version fails. Four data points, and the difference between 50% and 95% is one hidden layer.
            </p>
          </section>

          <section>
            <h2 id="convolutions" className="font-display text-lg font-semibold text-foreground mb-3">Convolutions: from scratch, then applied</h2>
            <p>
              Before touching <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">nn.Conv2d</code>, I wrote 1D and 2D convolution in NumPy. A convolution is a sliding window doing element-wise multiplication and summing. Written as nested for-loops it looks trivial, but that's the point. You see exactly what the operation does before the framework hides it.
            </p>
            <CodeBlock lang="python" code={`def conv2d(image, kernel):
    """NumPy 2D convolution — the operation behind nn.Conv2d"""
    ki, kj = kernel.shape
    out_h = image.shape[0] - ki + 1
    out_w = image.shape[1] - kj + 1
    output = np.zeros((out_h, out_w))

    for i in range(out_h):
        for j in range(out_w):
            output[i, j] = np.sum(
                image[i:i+ki, j:j+kj] * kernel
            )
    return output`} />
            <p className="mt-3">
              Then I applied it to actual datasets: <strong className="text-foreground">CIFAR-10</strong> classification with a LeNet-style CNN, and <strong className="text-foreground">CelebA smile detection</strong> as a binary task.
            </p>

            <h3 id="cifar" className="font-display text-base font-semibold text-foreground mt-6 mb-2">CIFAR-10 CNN</h3>
            <p>
              A classic architecture: two conv layers with ReLU and max pooling, then three fully-connected layers. The conv layers go from 3 channels (RGB) to 6 to 16, with 5×5 kernels. After pooling, the feature map is 16×5×5 = 400 values, which feed into a 120→84→10 classifier.
            </p>
            <CodeBlock lang="python" code={`class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 16 * 5 * 5)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        return self.fc3(x)`} />

            <h3 id="celeba" className="font-display text-base font-semibold text-foreground mt-6 mb-2">CelebA smile classification</h3>
            <p>
              CelebA was a step up: over 200,000 face images, binary target (smiling or not). Best epoch hit <strong className="text-foreground">~89.6% validation accuracy</strong>. This was the first project where I ran into problems that don't exist in toy datasets. Data augmentation actually mattered. Class balance shifted the loss landscape. And the model started overfitting on faces fast if I wasn't careful with regularization.
            </p>
          </section>

          <section>
            <h2 id="sequences" className="font-display text-lg font-semibold text-foreground mb-3">Sequences: RNNs and character-level language models</h2>
            <p>
              I started sequences by writing a manual RNN forward pass and comparing it to <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">nn.RNN</code>'s output. Same numbers. An RNN is a linear layer applied over and over, passing its hidden state forward each time. Seeing that loop spelled out made the architecture less intimidating.
            </p>

            <h3 id="imdb" className="font-display text-base font-semibold text-foreground mt-6 mb-2">IMDB sentiment analysis</h3>
            <p>
              IMDB sentiment classification with <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">torchtext</code>: tokenize reviews, build vocabulary, embed, feed into an RNN. First epochs are rough (56% accuracy, barely above coin flip), but it learns.
            </p>
            <p className="mt-3">
              Honestly the bigger lesson here was about infrastructure, not models. <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">torchtext</code> changed its API between versions, and things that worked in the tutorial I was following just broke. I spent more time debugging the data pipeline than the RNN itself.
            </p>

            <h3 id="char-lm" className="font-display text-base font-semibold text-foreground mt-6 mb-2">Character-level language model</h3>
            <p>
              An RNN/LSTM trained to predict the next character given previous ones. Feed it a text corpus, let it train. By epoch 9,500 the loss was down to 1.04 and the generated text had recognizable words and sentence fragments. It's the same principle as GPT, just at character scale and with a much smaller model.
            </p>
          </section>

          <section>
            <h2 id="transfer-learning" className="font-display text-lg font-semibold text-foreground mb-3">Transfer learning with ResNet</h2>
            <p>
              Training from scratch works when you have enough data (CIFAR, CelebA). For small datasets it doesn't. I fine-tuned a pretrained <strong className="text-foreground">ResNet-18</strong> on a small ants-vs-bees dataset two ways:
            </p>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Full fine-tuning:</strong> unfreeze all layers, train everything with a small learning rate and a step scheduler.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Feature extraction:</strong> freeze the backbone, only train the final classification head. Faster, less risk of overfitting, works well when the pretrained domain is close to yours.</span>
              </li>
            </ul>
            <CodeBlock lang="python" code={`model = models.resnet18(pretrained=True)

# Replace the final fully-connected layer for 2 classes
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 2)
model.to(device)

# For feature extraction: freeze everything except fc
for param in model.parameters():
    param.requires_grad = False
for param in model.fc.parameters():
    param.requires_grad = True`} />
          </section>

          <section>
            <h2 id="transformers" className="font-display text-lg font-semibold text-foreground mb-3">Transformers: building the attention mechanism</h2>
            <p>
              Last stretch: token embeddings, positional encoding, and the attention mechanism. I didn't build a full trainable transformer, but I got far enough to understand what <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">F.softmax(scores, dim=-1)</code> actually does in QKV attention, and why you need positional encoding once you drop the sequential assumption of RNNs.
            </p>
            <p className="mt-3">
              The way I think about it now: attention is a soft lookup table. The query says "what am I looking for", the keys say "here's what I have", and the values are what gets returned. The softmax over dot products is just a differentiable way to pick which values matter most. Once I saw it that way, the architecture felt less alien.
            </p>
          </section>

          <section>
            <h2 id="miniprojects" className="font-display text-lg font-semibold text-foreground mb-3">Miniprojects: putting it together</h2>
            <p>
              Alongside the fundamentals, I did a few end-to-end projects to see if I could actually wire everything together into working pipelines:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {[
                { title: 'MNIST Classification', desc: 'PyTorch MLP + Lightning, 96.5% test accuracy', tech: 'PyTorch · torchmetrics' },
                { title: 'Mileage Prediction', desc: 'Tabular regression, test MSE ~9.59', tech: 'PyTorch · Pandas' },
                { title: 'Smile Detection', desc: 'CNN on CelebA, ~89.6% val accuracy', tech: 'PyTorch · torchvision' },
                { title: 'Character LM', desc: 'RNN text generation, loss ~1.04', tech: 'PyTorch · LSTM' },
              ].map(p => (
                <div key={p.title} className="bg-card border border-border rounded-xl p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">{p.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{p.desc}</p>
                  <p className="text-[10px] text-primary">{p.tech}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 id="tooling" className="font-display text-lg font-semibold text-foreground mb-3">Tooling that helped</h2>
            <p>
              Two things I'm glad I set up early:
            </p>
            <ul className="space-y-3 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">TensorBoard</strong> for watching training runs. Loss curves, accuracy over epochs, image grids of predictions, even the computation graph. When the loss plateaus, you see it immediately instead of staring at printed numbers. I logged MNIST metrics and PR curves per class to figure out which digits the model kept confusing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Poetry</strong> for dependencies. Both repos use <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">pyproject.toml</code> with pinned PyTorch versions (2.3 and 2.4). Even for learning projects, you don't want to debug your environment at the same time as your model.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="lessons" className="font-display text-lg font-semibold text-foreground mb-3">What I'd tell someone starting this path</h2>
            <ul className="space-y-3 mt-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Write backprop by hand at least once.</strong> It's tedious. But after you've manually applied the chain rule through two layers in NumPy, <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">loss.backward()</code> becomes a function call you actually understand.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">XOR teaches more than MNIST for understanding depth.</strong> MNIST is the standard benchmark, but XOR shows you why hidden layers matter with 4 data points. You can plot the decision boundary and see the failure.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Data pipelines break more often than models.</strong> I spent more time debugging <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">DataLoader</code> issues, file paths, and text tokenization than I spent debugging model architectures. Budget time accordingly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Use real datasets early.</strong> Synthetic data teaches you the algorithm. Real data teaches you everything else: class imbalance, noisy labels, preprocessing decisions that change your results more than model architecture does.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Don't skip the boring parts.</strong> Model saving, checkpointing, GPU placement, environment setup. I put these off at first and regretted it. A model you can't reload or reproduce is a model you'll end up retraining from scratch.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 id="retrospective" className="font-display text-lg font-semibold text-foreground mb-3">Worth trying next</h2>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <p>
                <strong className="text-foreground">Implement a small transformer from scratch.</strong> I built the attention mechanism and embedding layers, but didn't assemble a full trainable transformer. A character-level GPT on a small corpus would close the loop between the RNN language model and the transformer attention components.
              </p>
              <p>
                <strong className="text-foreground">Add proper evaluation beyond accuracy.</strong> Most of my projects just report accuracy or loss. That's not enough. Confusion matrices, per-class metrics, calibration curves. I should build a reusable evaluation harness instead of ad-hoc metrics in every notebook.
              </p>
              <p>
                <strong className="text-foreground">Try distributed training.</strong> Everything here runs on one GPU or CPU. I haven't touched <code className="px-1.5 py-0.5 bg-muted rounded text-xs text-foreground">DistributedDataParallel</code> or Lightning's multi-GPU support. That's the gap between "I can train a model" and "I can train a model at scale."
              </p>
              <p>
                <strong className="text-foreground">Build something with Hugging Face.</strong> I understand the transformer mechanism now, but I haven't fine-tuned a pretrained language model on an actual task yet. Classification, summarization, NER, something practical with the ecosystem people actually use in production.
              </p>
            </div>
          </section>

          <section>
            <h2 id="conclusion" className="font-display text-lg font-semibold text-foreground mb-3">Wrapping up</h2>
            <p>
              Building everything twice is slow. There are faster ways to get productive with ML. But when a model misbehaves now, I know which layer to check and what the gradients should look like. When I read a paper, I can map the equations to code without much effort. That understanding came from the NumPy versions, not the PyTorch ones.
            </p>
            <p className="mt-3">
              The full set: 12 algorithm implementations, 5 miniprojects, 15 PyTorch scripts going from tensors to TensorBoard. None of it is production code. All of it is why I can write production code now.
            </p>
            <p className="mt-3">
              If you're starting out, I'd recommend the same thing. Build it from scratch first. Then build it properly. The second pass goes much faster when you already know what's supposed to happen.
            </p>
          </section>

        </div>

        <BlogNav />

      </article>
    </main>
  )
}
