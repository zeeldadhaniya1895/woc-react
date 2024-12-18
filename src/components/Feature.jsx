export default function FeatureHighlight({ title, description, features }) {
    return (
        <section className="mb-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-lg text-gray-600">{description}</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                    <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                ))}
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow text-center">
            <i className={`${icon} text-blue-600 text-4xl mb-4`}></i>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}