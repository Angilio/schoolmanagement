<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Archive annuelle des bulletins</title>

    <style>
        * {
            box-sizing: border-box;
        }

        @page {
            margin: 15px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #111827;
            margin: 0;
            padding: 0;
        }

        .header {
            border: 2px solid #111827;
            padding: 10px;
            margin-bottom: 10px;
            text-align: center;
        }

        .school {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .title {
            margin-top: 6px;
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .subtitle {
            margin-top: 5px;
            font-size: 11px;
        }

        .meta {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .meta td {
            border: 1px solid #111827;
            padding: 6px;
            font-weight: bold;
        }

        .info-box {
            border: 1px solid #111827;
            background: #f3f4f6;
            padding: 7px;
            margin-bottom: 10px;
            font-size: 10px;
            line-height: 1.5;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .table th,
        .table td {
            border: 1px solid #111827;
            padding: 5px;
            text-align: center;
            vertical-align: middle;
        }

        .table th {
            background: #e5e7eb;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9px;
        }

        .left {
            text-align: left !important;
        }

        .student-name {
            font-weight: bold;
        }

        .rank {
            font-weight: bold;
            color: #111827;
        }

        .average {
            font-weight: bold;
            color: #065f46;
        }

        .annual {
            background: #ecfdf5;
            font-weight: bold;
        }

        .observation-complet {
            color: #047857;
            font-weight: bold;
        }

        .observation-incomplet {
            color: #b45309;
            font-weight: bold;
        }

        .observation-none {
            color: #b91c1c;
            font-weight: bold;
        }

        .footer {
            margin-top: 22px;
            width: 100%;
            border-collapse: collapse;
        }

        .footer td {
            width: 33.33%;
            text-align: center;
            vertical-align: top;
            padding-top: 15px;
        }

        .signature-box {
            height: 65px;
            border-top: 1px solid #111827;
            margin: 40px 25px 0 25px;
            padding-top: 6px;
            font-weight: bold;
        }

        .small {
            margin-top: 12px;
            font-size: 9px;
            color: #374151;
            text-align: center;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    @php
        $trimesterCount = count($trimestres);
        $tableColspan = 4 + ($trimesterCount * 2) + 3;
    @endphp

    <div class="header">
        <div class="school">
            Lycée Privé A.P.E
        </div>

        <div class="title">
            Archive annuelle des bulletins
        </div>

        <div class="subtitle">
            Année scolaire :
            <strong>{{ $schoolYear->year ?? $schoolYear->name ?? '-' }}</strong>
        </div>
    </div>

    <table class="meta">
        <tr>
            <td>Classe : {{ $classe->name ?? '-' }}</td>
            <td>Section : {{ $section->name ?? 'Toutes' }}</td>
            <td>Série : {{ $serie->name ?? 'Toutes / Sans série' }}</td>
        </tr>

        <tr>
            <td colspan="2">
                Date de génération :
                {{ $generatedAt ? $generatedAt->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}
            </td>

            <td>
                Nombre d’élèves :
                {{ is_countable($rows) ? count($rows) : 0 }}
            </td>
        </tr>
    </table>

    <div class="info-box">
        <strong>Mode de calcul :</strong>
        Pour chaque trimestre, s’il existe plusieurs évaluations dans une même matière,
        le système calcule d’abord la moyenne de ces évaluations. Cette moyenne est ensuite
        placée dans le bulletin. La moyenne générale est calculée avec les coefficients.
        Le rang est établi selon la moyenne générale.
    </div>

    <table class="table">
        <thead>
            <tr>
                <th style="width: 28px;">N°</th>
                <th class="left" style="width: 145px;">Élève</th>
                <th style="width: 70px;">Matricule</th>
                <th style="width: 95px;">Classe</th>

                @foreach ($trimestres as $trimestre)
                    <th>
                        {{ $trimestre->name ?? $trimestre->title ?? 'Trimestre' }}
                    </th>
                    <th style="width: 45px;">Rang</th>
                @endforeach

                <th style="width: 70px;">Moy. annuelle</th>
                <th style="width: 55px;">Rang annuel</th>
                <th style="width: 75px;">Obs.</th>
            </tr>
        </thead>

        <tbody>
            @forelse ($rows as $index => $row)
                @php
                    $student = $row['student'];
                    $completedTrimestres = $row['completed_trimestres'] ?? 0;
                @endphp

                <tr>
                    <td>{{ $index + 1 }}</td>

                    <td class="left student-name">
                        {{ $student->user->name ?? '-' }}
                    </td>

                    <td>
                        {{ $student->matricule ?? '-' }}
                    </td>

                    <td>
                        {{ $student->classe->name ?? '-' }}
                        {{ $student->serie->name ?? '' }}
                        {{ $student->section->name ?? '' }}
                    </td>

                    @foreach ($row['trimestres'] as $trimesterResult)
                        <td class="average">
                            {{ $trimesterResult['moyenne'] !== null ? number_format($trimesterResult['moyenne'], 2, ',', ' ') : '-' }}
                        </td>

                        <td class="rank">
                            {{ $trimesterResult['rang'] ?? '-' }}
                        </td>
                    @endforeach

                    <td class="annual">
                        {{ $row['annual_average'] !== null ? number_format($row['annual_average'], 2, ',', ' ') : '-' }}
                    </td>

                    <td class="annual rank">
                        {{ $row['annual_rank'] ?? '-' }}
                    </td>

                    <td>
                        @if ($completedTrimestres >= 3)
                            <span class="observation-complet">Complet</span>
                        @elseif ($completedTrimestres > 0)
                            <span class="observation-incomplet">Incomplet</span>
                        @else
                            <span class="observation-none">Aucun</span>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="{{ $tableColspan }}">
                        Aucun élève trouvé.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="footer">
        <tr>
            <td>
                <div class="signature-box">
                    Le titulaire
                </div>
            </td>

            <td>
                <div class="signature-box">
                    La direction
                </div>
            </td>

            <td>
                <div class="signature-box">
                    Cachet de l’établissement
                </div>
            </td>
        </tr>
    </table>

    <p class="small">
        Document généré automatiquement par le système de gestion scolaire.
    </p>
</body>
</html>